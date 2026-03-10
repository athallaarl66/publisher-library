import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authorSchema } from "../validators/authorValidator";

export const getAuthors = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
  const search = (req.query.search as string) ?? "";
  const sortBy = (req.query.sortBy as string) ?? "createdAt";
  const order = req.query.order === "asc" ? "asc" : "desc";

  const allowed = ["name", "createdAt", "updatedAt"];
  const resolvedSort = allowed.includes(sortBy) ? sortBy : "createdAt";

  try {
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const [authors, total] = await prisma.$transaction([
      prisma.author.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [resolvedSort]: order },
        include: { _count: { select: { books: true } } },
      }),
      prisma.author.count({ where }),
    ]);

    res.json({
      success: true,
      data: authors,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAuthor = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  try {
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: { include: { publisher: { select: { id: true, name: true } } } },
      },
    });

    if (!author) {
      res.status(404).json({ success: false, message: "Author not found" });
      return;
    }

    res.json({ success: true, data: author });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createAuthor = async (req: Request, res: Response) => {
  const parsed = authorSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const author = await prisma.author.create({ data: parsed.data });
    res
      .status(201)
      .json({ success: true, message: "Author created", data: author });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  const parsed = authorSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const author = await prisma.author.update({
      where: { id },
      data: parsed.data,
    });
    res.json({ success: true, message: "Author updated", data: author });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Author not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  try {
    await prisma.author.delete({ where: { id } });
    res.json({ success: true, message: "Author deleted" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Author not found" });
      return;
    }
    // handler hard delete
    if (err.code === "P2003") {
      res.status(409).json({
        success: false,
        message: "Cannot delete author with existing books",
      });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
