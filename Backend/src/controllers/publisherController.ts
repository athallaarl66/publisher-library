import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { publisherSchema } from "../validators/publisherValidator";

export const getPublishers = async (req: Request, res: Response) => {
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

    const [publishers, total] = await prisma.$transaction([
      prisma.publisher.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [resolvedSort]: order },
        include: { _count: { select: { books: true } } },
      }),
      prisma.publisher.count({ where }),
    ]);

    res.json({
      success: true,
      data: publishers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPublisher = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  try {
    const publisher = await prisma.publisher.findUnique({
      where: { id },
      include: {
        books: { include: { author: { select: { id: true, name: true } } } },
      },
    });

    if (!publisher) {
      res.status(404).json({ success: false, message: "Publisher not found" });
      return;
    }

    res.json({ success: true, data: publisher });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createPublisher = async (req: Request, res: Response) => {
  const parsed = publisherSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const publisher = await prisma.publisher.create({ data: parsed.data });
    res
      .status(201)
      .json({ success: true, message: "Publisher created", data: publisher });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updatePublisher = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  const parsed = publisherSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const publisher = await prisma.publisher.update({
      where: { id },
      data: parsed.data,
    });
    res.json({ success: true, message: "Publisher updated", data: publisher });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Publisher not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deletePublisher = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  try {
    await prisma.publisher.delete({ where: { id } });
    res.json({ success: true, message: "Publisher deleted" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Publisher not found" });
      return;
    }
    if (err.code === "P2003") {
      res.status(409).json({
        success: false,
        message: "Cannot delete publisher with existing books",
      });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
