import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

const COOKIE_NAME = "al_athaq_admin_session";

export type SessionPayload = {
  sub: string;
  email: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set (min 16 characters)");
  }
  return secret;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "8h",
    issuer: "al-athaq-api",
  });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      issuer: "al-athaq-api",
    }) as SessionPayload;
    if (!decoded?.sub || !decoded?.email) return null;
    return { sub: decoded.sub, email: decoded.email };
  } catch {
    return null;
  }
}

export function setSessionCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Response) {
  const secure = process.env.NODE_ENV === "production";
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
  });
}

export function readSessionToken(req: Request): string | null {
  const fromCookie = req.cookies?.[COOKIE_NAME];
  if (typeof fromCookie === "string" && fromCookie.length > 0) return fromCookie;

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim() || null;
  }
  return null;
}

export { COOKIE_NAME };
