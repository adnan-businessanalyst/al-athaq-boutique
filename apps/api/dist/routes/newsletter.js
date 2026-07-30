"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const validations_1 = require("../lib/validations");
const mailgun_1 = require("../lib/mailgun");
exports.newsletterRouter = (0, express_1.Router)();
const newsletterLimit = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests" },
});
exports.newsletterRouter.post("/", newsletterLimit, async (req, res) => {
    const origin = req.headers.origin;
    if (origin) {
        const allowed = (process.env.FRONTEND_URL || "http://localhost:3000")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => (/^https?:\/\//i.test(s) ? s : `https://${s}`));
        try {
            if (!allowed.includes(new URL(origin).origin)) {
                return res.status(403).json({ error: "Invalid origin" });
            }
        }
        catch {
            return res.status(403).json({ error: "Invalid origin" });
        }
    }
    const parsed = validations_1.newsletterSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid email" });
    }
    void (0, mailgun_1.notifyNewsletterSignup)(parsed.data.email).catch(() => undefined);
    return res.json({ ok: true, message: "Thanks for subscribing." });
});
//# sourceMappingURL=newsletter.js.map