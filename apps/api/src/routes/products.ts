import { Router } from "express";
import { prisma } from "../lib/prisma";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../lib/validations";
import {
  requireAuth,
  requireFreshPassword,
} from "../middleware/auth";
import { triggerStorefrontRevalidate } from "../lib/revalidate";

export const productsRouter = Router();

productsRouter.use(requireAuth, requireFreshPassword);

productsRouter.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return res.json({ products });
});

productsRouter.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json({ product });
});

productsRouter.post("/", async (req, res) => {
  const parsed = productCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
  }

  try {
    const product = await prisma.product.create({ data: parsed.data });
    void triggerStorefrontRevalidate();
    return res.status(201).json({ product });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    if (message.includes("Unique constraint")) {
      return res.status(409).json({ error: "Slug already exists" });
    }
    return res.status(500).json({ error: "Create failed" });
  }
});

productsRouter.patch("/:id", async (req, res) => {
  const parsed = productUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
  }

  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    void triggerStorefrontRevalidate();
    return res.json({ product });
  } catch {
    return res.status(404).json({ error: "Product not found" });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    void triggerStorefrontRevalidate();
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ error: "Product not found" });
  }
});
