import { Router } from "express";
import { prisma } from "../lib/prisma";
import {
  commerceSettingsSchema,
  orderStatusSchema,
  shippingMethodSchema,
  slotSchema,
  variantSchema,
  zoneSchema,
} from "../lib/validations";
import {
  requireAuth,
  requireFreshPassword,
} from "../middleware/auth";
import { triggerStorefrontRevalidate } from "../lib/revalidate";

export const adminCommerceRouter = Router();

adminCommerceRouter.use(requireAuth, requireFreshPassword);

// ——— Variants ———
adminCommerceRouter.get("/products/:productId/variants", async (req, res) => {
  const variants = await prisma.productVariant.findMany({
    where: { productId: req.params.productId },
    orderBy: { sortOrder: "asc" },
  });
  return res.json({ variants });
});

adminCommerceRouter.post("/products/:productId/variants", async (req, res) => {
  const parsed = variantSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const product = await prisma.product.findUnique({
    where: { id: req.params.productId },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (parsed.data.isDefault) {
    await prisma.productVariant.updateMany({
      where: { productId: product.id },
      data: { isDefault: false },
    });
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      label: parsed.data.label,
      size: parsed.data.size ?? null,
      weightGrams: parsed.data.weightGrams ?? null,
      sku: parsed.data.sku ?? null,
      priceHalalas: parsed.data.priceHalalas,
      quantityAvailable: parsed.data.quantityAvailable ?? 0,
      isDefault: parsed.data.isDefault ?? false,
      isActive: parsed.data.isActive ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    },
  });
  void triggerStorefrontRevalidate();
  return res.status(201).json({ variant });
});

adminCommerceRouter.patch("/variants/:id", async (req, res) => {
  const parsed = variantSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }
  try {
    const existing = await prisma.productVariant.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ error: "Variant not found" });

    if (parsed.data.isDefault) {
      await prisma.productVariant.updateMany({
        where: { productId: existing.productId },
        data: { isDefault: false },
      });
    }

    const variant = await prisma.productVariant.update({
      where: { id: existing.id },
      data: parsed.data,
    });
    void triggerStorefrontRevalidate();
    return res.json({ variant });
  } catch {
    return res.status(404).json({ error: "Variant not found" });
  }
});

adminCommerceRouter.delete("/variants/:id", async (req, res) => {
  try {
    await prisma.productVariant.delete({ where: { id: req.params.id } });
    void triggerStorefrontRevalidate();
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Variant not found" });
  }
});

// ——— Shipping methods ———
adminCommerceRouter.get("/shipping-methods", async (_req, res) => {
  const methods = await prisma.shippingMethod.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return res.json({ methods });
});

adminCommerceRouter.post("/shipping-methods", async (req, res) => {
  const parsed = shippingMethodSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const method = await prisma.shippingMethod.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? "",
      feeHalalas: parsed.data.feeHalalas,
      etaLabel: parsed.data.etaLabel ?? null,
      isActive: parsed.data.isActive ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    },
  });
  return res.status(201).json({ method });
});

adminCommerceRouter.patch("/shipping-methods/:id", async (req, res) => {
  const parsed = shippingMethodSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }
  try {
    const method = await prisma.shippingMethod.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    return res.json({ method });
  } catch {
    return res.status(404).json({ error: "Shipping method not found" });
  }
});

adminCommerceRouter.delete("/shipping-methods/:id", async (req, res) => {
  try {
    await prisma.shippingMethod.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Shipping method not found" });
  }
});

// ——— Zones ———
adminCommerceRouter.get("/zones", async (_req, res) => {
  const zones = await prisma.deliveryZone.findMany({
    orderBy: { name: "asc" },
    include: { slots: { orderBy: { sortOrder: "asc" } } },
  });
  return res.json({ zones });
});

adminCommerceRouter.post("/zones", async (req, res) => {
  const parsed = zoneSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const zone = await prisma.deliveryZone.create({ data: parsed.data });
  return res.status(201).json({ zone });
});

adminCommerceRouter.patch("/zones/:id", async (req, res) => {
  const parsed = zoneSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }
  try {
    const zone = await prisma.deliveryZone.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    return res.json({ zone });
  } catch {
    return res.status(404).json({ error: "Zone not found" });
  }
});

adminCommerceRouter.delete("/zones/:id", async (req, res) => {
  try {
    await prisma.deliveryZone.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Zone not found" });
  }
});

// ——— Slots ———
adminCommerceRouter.post("/slots", async (req, res) => {
  const parsed = slotSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const slot = await prisma.deliverySlot.create({
    data: {
      zoneId: parsed.data.zoneId,
      label: parsed.data.label,
      startTime: parsed.data.startTime ?? null,
      endTime: parsed.data.endTime ?? null,
      isActive: parsed.data.isActive ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    },
  });
  return res.status(201).json({ slot });
});

adminCommerceRouter.patch("/slots/:id", async (req, res) => {
  const parsed = slotSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }
  try {
    const slot = await prisma.deliverySlot.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    return res.json({ slot });
  } catch {
    return res.status(404).json({ error: "Slot not found" });
  }
});

adminCommerceRouter.delete("/slots/:id", async (req, res) => {
  try {
    await prisma.deliverySlot.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Slot not found" });
  }
});

// ——— Commerce settings ———
adminCommerceRouter.get("/commerce-settings", async (_req, res) => {
  const settings = await prisma.commerceSettings.findUnique({
    where: { id: "default" },
  });
  return res.json({ settings });
});

adminCommerceRouter.put("/commerce-settings", async (req, res) => {
  const parsed = commerceSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
  }
  const settings = await prisma.commerceSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed.data },
    update: parsed.data,
  });
  return res.json({ settings });
});

// ——— Orders ———
adminCommerceRouter.get("/orders", async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      items: true,
      zone: true,
      slot: true,
    },
  });
  return res.json({ orders });
});

adminCommerceRouter.get("/orders/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: true,
      zone: true,
      slot: true,
      address: true,
      customer: true,
    },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.json({ order });
});

adminCommerceRouter.patch("/orders/:id/status", async (req, res) => {
  const parsed = orderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    return res.json({ order });
  } catch {
    return res.status(404).json({ error: "Order not found" });
  }
});
