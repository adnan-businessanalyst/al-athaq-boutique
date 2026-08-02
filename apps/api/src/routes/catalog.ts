import { Router } from "express";
import { prisma } from "../lib/prisma";

export const catalogRouter = Router();

catalogRouter.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return res.json({ products });
});

catalogRouter.get("/products/:slug", async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json({ product });
});

catalogRouter.get("/commerce-settings", async (_req, res) => {
  const settings = await prisma.commerceSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    return res.status(404).json({ error: "Commerce settings not configured" });
  }
  return res.json({
    settings: {
      purchasePolicy: settings.purchasePolicy,
      deliveryInstructions: settings.deliveryInstructions,
      currencyLabel: settings.currencyLabel,
      shopWhatsAppE164: settings.shopWhatsAppE164,
      orderPrefix: settings.orderPrefix,
    },
  });
});
