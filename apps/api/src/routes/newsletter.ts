import { Router } from "express";
import rateLimit from "express-rate-limit";
import { newsletterSchema } from "../lib/validations";
import { notifyNewsletterSignup } from "../lib/mailgun";

export const newsletterRouter = Router();

const newsletterLimit = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

newsletterRouter.post("/", newsletterLimit, async (req, res) => {
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
    } catch {
      return res.status(403).json({ error: "Invalid origin" });
    }
  }

  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email" });
  }

  void notifyNewsletterSignup(parsed.data.email).catch(() => undefined);
  return res.json({ ok: true, message: "Thanks for subscribing." });
});
