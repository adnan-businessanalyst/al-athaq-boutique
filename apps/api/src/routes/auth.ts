import { Router } from "express";
import { prisma } from "../lib/prisma";
import {
  clearSessionCookie,
  setSessionCookie,
  signSession,
} from "../lib/auth";
import {
  daysUntilPasswordExpiry,
  hashPassword,
  isPasswordExpired,
  isStrongPassword,
  verifyPassword,
} from "../lib/password";
import { notifyLogin, notifyPasswordChanged } from "../lib/mailgun";
import { changePasswordSchema, loginSchema } from "../lib/validations";
import {
  requireAuth,
  type AuthedRequest,
} from "../middleware/auth";
import { loginRateLimit } from "../middleware/rateLimit";

export const authRouter = Router();

authRouter.post("/login", loginRateLimit, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid credentials payload" });
  }

  const email = parsed.data.email.toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  // Constant-ish failure path — do not reveal which field failed
  if (!admin) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const ok = await verifyPassword(admin.passwordHash, parsed.data.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signSession({ sub: admin.id, email: admin.email });
  setSessionCookie(res, token);

  const expired = isPasswordExpired(admin.passwordChangedAt);
  const daysRemaining = daysUntilPasswordExpiry(admin.passwordChangedAt);

  void notifyLogin(admin.email).catch(() => undefined);

  return res.json({
    ok: true,
    passwordExpired: expired,
    code: expired ? "PASSWORD_EXPIRED" : undefined,
    daysRemaining,
    admin: { id: admin.id, email: admin.email },
    token,
  });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  return res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  if (!req.admin) return res.status(401).json({ error: "Unauthorized" });
  return res.json({
    admin: { id: req.admin.id, email: req.admin.email },
    passwordExpired: req.admin.passwordExpired,
    daysRemaining: req.admin.daysRemaining,
    passwordChangedAt: req.admin.passwordChangedAt,
  });
});

authRouter.post(
  "/change-password",
  requireAuth,
  async (req: AuthedRequest, res) => {
    if (!req.admin) return res.status(401).json({ error: "Unauthorized" });

    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid password payload" });
    }

    if (!isStrongPassword(parsed.data.newPassword)) {
      return res.status(400).json({
        error:
          "New password must be at least 12 characters and include upper, lower, number, and special character.",
      });
    }

    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return res.status(400).json({
        error: "New password must be different from the current password.",
      });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: req.admin.id },
    });
    if (!admin) return res.status(401).json({ error: "Unauthorized" });

    const ok = await verifyPassword(
      admin.passwordHash,
      parsed.data.currentPassword,
    );
    if (!ok) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
      },
    });

    void notifyPasswordChanged(updated.email).catch(() => undefined);

    const token = signSession({ sub: updated.id, email: updated.email });
    setSessionCookie(res, token);

    return res.json({
      ok: true,
      passwordExpired: false,
      daysRemaining: daysUntilPasswordExpiry(updated.passwordChangedAt),
      token,
      admin: { id: updated.id, email: updated.email },
    });
  },
);

