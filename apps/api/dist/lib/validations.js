"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterSchema = exports.productUpdateSchema = exports.productCreateSchema = exports.mediaTypeSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email().max(254),
    password: zod_1.z.string().min(1).max(200),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1).max(200),
    newPassword: zod_1.z.string().min(12).max(200),
});
exports.mediaTypeSchema = zod_1.z.enum(["image", "video", "svg"]);
exports.productCreateSchema = zod_1.z.object({
    slug: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
    name: zod_1.z.string().trim().min(1).max(200),
    description: zod_1.z.string().trim().min(1).max(2000),
    category: zod_1.z.string().trim().min(1).max(100),
    mediaUrl: zod_1.z.string().trim().min(1).max(2048),
    mediaType: exports.mediaTypeSchema.default("image"),
    posterUrl: zod_1.z.string().trim().max(2048).nullable().optional(),
    alt: zod_1.z.string().trim().min(1).max(300),
    sortOrder: zod_1.z.number().int().min(0).max(100000).default(0),
});
exports.productUpdateSchema = exports.productCreateSchema.partial();
exports.newsletterSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email().max(254),
});
//# sourceMappingURL=validations.js.map