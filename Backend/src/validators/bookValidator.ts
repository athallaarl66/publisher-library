import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title required"),
  isbn: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  genre: z.string().optional().nullable(),
  synopsis: z.string().optional().nullable(),
  authorId: z.number().int().positive("Invalid author"),
  publisherId: z.number().int().positive("Invalid publisher"),
});

export type BookInput = z.infer<typeof bookSchema>;
