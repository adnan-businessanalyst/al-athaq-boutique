"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = require("./routes/auth");
const products_1 = require("./routes/products");
const newsletter_1 = require("./routes/newsletter");
const rateLimit_1 = require("./middleware/rateLimit");
function allowedOrigins() {
    const raw = process.env.FRONTEND_URL || "http://localhost:3000";
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (/^https?:\/\//i.test(s) ? s : `https://${s}`));
}
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin(origin, cb) {
            const allowed = allowedOrigins();
            if (!origin)
                return cb(null, true);
            if (allowed.includes(origin))
                return cb(null, true);
            return cb(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use((0, cookie_parser_1.default)());
    app.use(rateLimit_1.apiRateLimit);
    app.get("/health", (_req, res) => {
        res.json({ ok: true, service: "al-athaq-api" });
    });
    app.use("/auth", auth_1.authRouter);
    app.use("/products", products_1.productsRouter);
    app.use("/newsletter", newsletter_1.newsletterRouter);
    app.use((err, _req, res, _next) => {
        const message = err instanceof Error ? err.message : "Server error";
        if (message.startsWith("CORS blocked")) {
            return res.status(403).json({ error: message });
        }
        console.error("[api]", message);
        return res.status(500).json({ error: "Internal server error" });
    });
    return app;
}
//# sourceMappingURL=app.js.map