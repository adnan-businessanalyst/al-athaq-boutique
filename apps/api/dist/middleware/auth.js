"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireFreshPassword = requireFreshPassword;
const prisma_1 = require("../lib/prisma");
const password_1 = require("../lib/password");
const auth_1 = require("../lib/auth");
async function requireAuth(req, res, next) {
    try {
        const token = (0, auth_1.readSessionToken)(req);
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const session = (0, auth_1.verifySession)(token);
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const admin = await prisma_1.prisma.adminUser.findUnique({
            where: { id: session.sub },
        });
        if (!admin || admin.email !== session.email) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const expired = (0, password_1.isPasswordExpired)(admin.passwordChangedAt);
        const daysRemaining = (0, password_1.daysUntilPasswordExpiry)(admin.passwordChangedAt);
        req.admin = {
            id: admin.id,
            email: admin.email,
            passwordChangedAt: admin.passwordChangedAt,
            passwordExpired: expired,
            daysRemaining,
        };
        return next();
    }
    catch (err) {
        console.error("[auth]", err instanceof Error ? err.message : "error");
        return res.status(401).json({ error: "Unauthorized" });
    }
}
/** Block product CRUD when password expired — change-password still allowed */
function requireFreshPassword(req, res, next) {
    if (!req.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.admin.passwordExpired) {
        return res.status(403).json({
            error: "PASSWORD_EXPIRED",
            code: "PASSWORD_EXPIRED",
            message: "Password must be changed before accessing admin tools.",
            daysRemaining: req.admin.daysRemaining,
        });
    }
    return next();
}
//# sourceMappingURL=auth.js.map