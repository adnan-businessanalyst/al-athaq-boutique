import { z } from "zod";

export const mediaTypeSchema = z.enum(["image", "video", "svg"]);

export const mediaAssetSchema = z.object({
  mediaUrl: z.string().max(2048).nullable(),
  mediaType: mediaTypeSchema,
  posterUrl: z.string().max(2048).nullable().optional(),
  alt: z.string().min(1).max(300),
});

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(2000),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
