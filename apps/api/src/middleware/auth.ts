import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  daysUntilPasswordExpiry,
  isPasswordExpired,
} from "../lib/password";
import { readSessionToken, verifySession } from "../lib/auth";

export type AuthedRequest = Request & {
  admin?: {
    id: string;
    email: string;
    passwordChangedAt: Date;
    passwordExpired: boolean;
    daysRemaining: number;
  };
};

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = readSessionToken(req);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const session = verifySession(token);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.sub },
    });
    if (!admin || admin.email !== session.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const expired = isPasswordExpired(admin.passwordChangedAt);
    const daysRemaining = daysUntilPasswordExpiry(admin.passwordChangedAt);

    req.admin = {
      id: admin.id,
      email: admin.email,
      passwordChangedAt: admin.passwordChangedAt,
      passwordExpired: expired,
      daysRemaining,
    };

    return next();
  } catch (err) {
    console.error("[auth]", err instanceof Error ? err.message : "error");
    return res.status(401).json({ error: "Unauthorized" });
  }
}

/** Block product CRUD when password expired — change-password still allowed */
export function requireFreshPassword(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
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
