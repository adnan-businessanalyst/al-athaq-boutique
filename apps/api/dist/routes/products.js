"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const validations_1 = require("../lib/validations");
const auth_1 = require("../middleware/auth");
const revalidate_1 = require("../lib/revalidate");
exports.productsRouter = (0, express_1.Router)();
exports.productsRouter.use(auth_1.requireAuth, auth_1.requireFreshPassword);
exports.productsRouter.get("/", async (_req, res) => {
    const products = await prisma_1.prisma.product.findMany({
        orderBy: { sortOrder: "asc" },
    });
    return res.json({ products });
});
exports.productsRouter.get("/:id", async (req, res) => {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: req.params.id },
    });
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    return res.json({ product });
});
exports.productsRouter.post("/", async (req, res) => {
    const parsed = validations_1.productCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten(),
        });
    }
    try {
        const product = await prisma_1.prisma.product.create({ data: parsed.data });
        void (0, revalidate_1.triggerStorefrontRevalidate)();
        return res.status(201).json({ product });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Create failed";
        if (message.includes("Unique constraint")) {
            return res.status(409).json({ error: "Slug already exists" });
        }
        return res.status(500).json({ error: "Create failed" });
    }
});
exports.productsRouter.patch("/:id", async (req, res) => {
    const parsed = validations_1.productUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten(),
        });
    }
    try {
        const product = await prisma_1.prisma.product.update({
            where: { id: req.params.id },
            data: parsed.data,
        });
        void (0, revalidate_1.triggerStorefrontRevalidate)();
        return res.json({ product });
    }
    catch {
        return res.status(404).json({ error: "Product not found" });
    }
});
exports.productsRouter.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.product.delete({ where: { id: req.params.id } });
        void (0, revalidate_1.triggerStorefrontRevalidate)();
        return res.json({ ok: true });
    }
    catch {
        return res.status(404).json({ error: "Product not found" });
    }
});
//# sourceMappingURL=products.js.map