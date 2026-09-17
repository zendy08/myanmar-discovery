import { z } from "zod";

/**
 * Contact form payload.
 * `company` is a honeypot: real readers leave it empty. Bots often fill every
 * field, so a max-length of 0 lets us reject or (better) silently accept them
 * without advertising that the field is a trap.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).pipe(z.email()),
  message: z.string().trim().min(1).max(2000),
  company: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
