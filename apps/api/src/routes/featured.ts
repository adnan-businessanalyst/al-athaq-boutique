import { Router } from "express";
import { prisma } from "../lib/prisma";
import { featuredUpsertSchema } from "../lib/validations";
import {
  requireAuth,
  requireFreshPassword,
} from "../middleware/auth";
import { triggerStorefrontRevalidate } from "../lib/revalidate";

export const featuredRouter = Router();

featuredRouter.use(requireAuth, requireFreshPassword);

featuredRouter.get("/", async (_req, res) => {
  const featured = await prisma.featured.findMany({
    orderBy: { position: "asc" },
    include: { product: true },
  });
  return res.json({ featured });
});

featuredRouter.put("/:position", async (req, res) => {
  const position = Number(req.params.position);
  const parsed = featuredUpsertSchema.safeParse({
    position,
    productId: req.body?.productId,
  });
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const featured = await prisma.featured.upsert({
    where: { position: parsed.data.position },
    create: {
      position: parsed.data.position,
      productId: parsed.data.productId,
    },
    update: { productId: parsed.data.productId },
    include: { product: true },
  });

  void triggerStorefrontRevalidate();
  return res.json({ featured });
});

featuredRouter.delete("/:position", async (req, res) => {
  const position = Number(req.params.position);
  if (![1, 2, 3, 4].includes(position)) {
    return res.status(400).json({ error: "Position must be 1–4" });
  }

  try {
    await prisma.featured.delete({ where: { position } });
    void triggerStorefrontRevalidate();
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Featured slot not found" });
  }
});
