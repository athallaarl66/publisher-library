import { z } from "zod";

export const publisherSchema = z.object({
  name: z.string().min(2, "Name at least 2 characters"),
  address: z.string().optional(),
  // or(z.literal("")) biar field kosong ga error validasi email
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export type PublisherInput = z.infer<typeof publisherSchema>;
