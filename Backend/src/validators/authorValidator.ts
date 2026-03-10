import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "Name at least 2 characters"),
  bio: z.string().optional(),
  birthDate: z.string().datetime().optional().nullable(),
});

export type AuthorInput = z.infer<typeof authorSchema>;
