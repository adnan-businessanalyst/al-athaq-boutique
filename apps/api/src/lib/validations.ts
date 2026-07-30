import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(200),
});

export const mediaTypeSchema = z.enum(["image", "video", "svg"]);

export const productCreateSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  category: z.string().trim().min(1).max(100),
  mediaUrl: z.string().trim().min(1).max(2048),
  mediaType: mediaTypeSchema.default("image"),
  posterUrl: z.string().trim().max(2048).nullable().optional(),
  alt: z.string().trim().min(1).max(300),
  sortOrder: z.number().int().min(0).max(100000).default(0),
});

export const productUpdateSchema = productCreateSchema.partial();

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const featuredUpsertSchema = z.object({
  position: z.number().int().min(1).max(4),
  productId: z.string().trim().min(1).max(64),
});
