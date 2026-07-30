"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const password_1 = require("../lib/password");
const mailgun_1 = require("../lib/mailgun");
const validations_1 = require("../lib/validations");
const auth_2 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login", rateLimit_1.loginRateLimit, async (req, res) => {
    const parsed = validations_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid credentials payload" });
    }
    const email = parsed.data.email.toLowerCase();
    const admin = await prisma_1.prisma.adminUser.findUnique({ where: { email } });
    // Constant-ish failure path — do not reveal which field failed
    if (!admin) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const ok = await (0, password_1.verifyPassword)(admin.passwordHash, parsed.data.password);
    if (!ok) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = (0, auth_1.signSession)({ sub: admin.id, email: admin.email });
    (0, auth_1.setSessionCookie)(res, token);
    const expired = (0, password_1.isPasswordExpired)(admin.passwordChangedAt);
    const daysRemaining = (0, password_1.daysUntilPasswordExpiry)(admin.passwordChangedAt);
    void (0, mailgun_1.notifyLogin)(admin.email).catch(() => undefined);
    return res.json({
        ok: true,
        passwordExpired: expired,
        code: expired ? "PASSWORD_EXPIRED" : undefined,
        daysRemaining,
        admin: { id: admin.id, email: admin.email },
        token,
    });
});
exports.authRouter.post("/logout", (_req, res) => {
    (0, auth_1.clearSessionCookie)(res);
    return res.json({ ok: true });
});
exports.authRouter.get("/me", auth_2.requireAuth, async (req, res) => {
    if (!req.admin)
        return res.status(401).json({ error: "Unauthorized" });
    return res.json({
        admin: { id: req.admin.id, email: req.admin.email },
        passwordExpired: req.admin.passwordExpired,
        daysRemaining: req.admin.daysRemaining,
        passwordChangedAt: req.admin.passwordChangedAt,
    });
});
exports.authRouter.post("/change-password", auth_2.requireAuth, async (req, res) => {
    if (!req.admin)
        return res.status(401).json({ error: "Unauthorized" });
    const parsed = validations_1.changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid password payload" });
    }
    if (!(0, password_1.isStrongPassword)(parsed.data.newPassword)) {
        return res.status(400).json({
            error: "New password must be at least 12 characters and include upper, lower, number, and special character.",
        });
    }
    if (parsed.data.currentPassword === parsed.data.newPassword) {
        return res.status(400).json({
            error: "New password must be different from the current password.",
        });
    }
    const admin = await prisma_1.prisma.adminUser.findUnique({
        where: { id: req.admin.id },
    });
    if (!admin)
        return res.status(401).json({ error: "Unauthorized" });
    const ok = await (0, password_1.verifyPassword)(admin.passwordHash, parsed.data.currentPassword);
    if (!ok) {
        return res.status(401).json({ error: "Current password is incorrect" });
    }
    const passwordHash = await (0, password_1.hashPassword)(parsed.data.newPassword);
    const updated = await prisma_1.prisma.adminUser.update({
        where: { id: admin.id },
        data: {
            passwordHash,
            passwordChangedAt: new Date(),
        },
    });
    void (0, mailgun_1.notifyPasswordChanged)(updated.email).catch(() => undefined);
    const token = (0, auth_1.signSession)({ sub: updated.id, email: updated.email });
    (0, auth_1.setSessionCookie)(res, token);
    return res.json({
        ok: true,
        passwordExpired: false,
        daysRemaining: (0, password_1.daysUntilPasswordExpiry)(updated.passwordChangedAt),
        token,
        admin: { id: updated.id, email: updated.email },
    });
});
//# sourceMappingURL=auth.js.map