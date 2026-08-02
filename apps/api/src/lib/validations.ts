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
  longDescription: z.string().trim().max(10000).optional(),
  category: z.string().trim().min(1).max(100),
  mediaUrl: z.string().trim().min(1).max(2048),
  mediaType: mediaTypeSchema.default("image"),
  posterUrl: z.string().trim().max(2048).nullable().optional(),
  alt: z.string().trim().min(1).max(300),
  sortOrder: z.number().int().min(0).max(100000).default(0),
  isActive: z.boolean().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const variantSchema = z.object({
  label: z.string().trim().min(1).max(120),
  size: z.string().trim().max(80).nullable().optional(),
  weightGrams: z.number().int().min(0).max(1_000_000).nullable().optional(),
  sku: z.string().trim().max(80).nullable().optional(),
  priceHalalas: z.number().int().min(0).max(100_000_000),
  quantityAvailable: z.number().int().min(0).max(1_000_000).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
});

export const shippingMethodSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  feeHalalas: z.number().int().min(0).max(10_000_000),
  etaLabel: z.string().trim().max(120).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const featuredUpsertSchema = z.object({
  position: z.number().int().min(1).max(4),
  productId: z.string().trim().min(1).max(64),
});

export const customerRegisterSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(200),
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().min(7).max(30).optional(),
});

export const customerLoginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

export const deliveryValidateSchema = z.object({
  country: z.string().trim().min(2).max(2).default("SA"),
  city: z.string().trim().min(1).max(120),
  district: z.string().trim().max(120).optional().nullable(),
});

export const zoneSchema = z.object({
  name: z.string().trim().min(1).max(160),
  country: z.string().trim().min(2).max(2).default("SA"),
  city: z.string().trim().min(1).max(120),
  district: z.string().trim().max(120).nullable().optional(),
  isActive: z.boolean().optional(),
  shippingFeeHalalas: z.number().int().min(0).max(10_000_000),
  leadTimeDaysMin: z.number().int().min(0).max(60).default(1),
  leadTimeDaysMax: z.number().int().min(0).max(90).default(3),
  etaLabel: z.string().trim().max(120).nullable().optional(),
});

export const slotSchema = z.object({
  zoneId: z.string().trim().min(1),
  label: z.string().trim().min(1).max(160),
  startTime: z.string().trim().max(16).nullable().optional(),
  endTime: z.string().trim().max(16).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
});

export const commerceSettingsSchema = z.object({
  purchasePolicy: z.string().trim().min(1).max(50000),
  deliveryInstructions: z.string().trim().min(1).max(50000),
  shippingPolicy: z.string().trim().max(50000).optional(),
  returnPolicy: z.string().trim().max(50000).optional(),
  orderPrefix: z.string().trim().min(1).max(12),
  shopWhatsAppE164: z.string().trim().max(30).nullable().optional(),
  currencyLabel: z.string().trim().min(1).max(8).default("SAR"),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
  guest: z
    .object({
      email: z.string().trim().email().max(254),
      phone: z.string().trim().min(7).max(30),
      fullName: z.string().trim().min(1).max(160),
    })
    .optional(),
  address: z.object({
    line1: z.string().trim().min(1).max(300),
    line2: z.string().trim().max(300).nullable().optional(),
    city: z.string().trim().min(1).max(120),
    district: z.string().trim().max(120).nullable().optional(),
    country: z.string().trim().min(2).max(2).default("SA"),
    postalCode: z.string().trim().max(20).nullable().optional(),
    notes: z.string().trim().max(500).nullable().optional(),
  }),
  zoneId: z.string().trim().min(1),
  slotId: z.string().trim().min(1),
  shippingMethodId: z.string().trim().min(1),
  deliveryDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  policyAccepted: z.literal(true),
  customerNotes: z.string().trim().max(1000).nullable().optional(),
});

export const orderStatusSchema = z.object({
  fulfillmentStatus: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
  locationVerificationStatus: z
    .enum(["PENDING", "VERIFIED", "REJECTED", "NEEDS_REVIEW"])
    .optional(),
  paymentStatus: z
    .enum(["UNPAID", "PENDING", "PAID", "FAILED", "REFUNDED"])
    .optional(),
});
