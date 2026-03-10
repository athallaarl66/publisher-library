import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { bookSchema } from "../validators/bookValidator";

export const getBooks = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
  const search = (req.query.search as string) ?? "";
  const authorId = req.query.authorId
    ? parseInt(req.query.authorId as string)
    : undefined;
  const publisherId = req.query.publisherId
    ? parseInt(req.query.publisherId as string)
    : undefined;
  const genre = (req.query.genre as string) ?? "";
  const sortBy = (req.query.sortBy as string) ?? "createdAt";
  const order = req.query.order === "asc" ? "asc" : "desc";

  const allowed = ["title", "publishedAt", "createdAt"];
  const resolvedSort = allowed.includes(sortBy) ? sortBy : "createdAt";

  try {
    const where: any = {};
    if (search) where.title = { contains: search, mode: "insensitive" };
    if (authorId && !isNaN(authorId)) where.authorId = authorId;
    if (publisherId && !isNaN(publisherId)) where.publisherId = publisherId;
    if (genre) where.genre = { contains: genre, mode: "insensitive" };

    const [books, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [resolvedSort]: order },
        include: {
          author: { select: { id: true, name: true } },
          publisher: { select: { id: true, name: true } },
        },
      }),
      prisma.book.count({ where }),
    ]);

    res.json({
      success: true,
      data: books,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBook = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true, publisher: true },
    });

    if (!book) {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }

    res.json({ success: true, data: book });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const book = await prisma.book.create({
      data: parsed.data,
      include: {
        author: { select: { id: true, name: true } },
        publisher: { select: { id: true, name: true } },
      },
    });
    res
      .status(201)
      .json({ success: true, message: "Book created", data: book });
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ success: false, message: "ISBN already exists" });
      return;
    }
    if (err.code === "P2003") {
      res
        .status(400)
        .json({ success: false, message: "Author or Publisher not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  const parsed = bookSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const book = await prisma.book.update({
      where: { id },
      data: parsed.data,
      include: {
        author: { select: { id: true, name: true } },
        publisher: { select: { id: true, name: true } },
      },
    });
    res.json({ success: true, message: "Book updated", data: book });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ success: false, message: "ISBN already exists" });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid ID" });
    return;
  }

  try {
    await prisma.book.delete({ where: { id } });
    res.json({ success: true, message: "Book deleted" });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Book not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
