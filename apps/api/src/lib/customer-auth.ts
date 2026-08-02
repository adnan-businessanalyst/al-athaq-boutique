import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

const COOKIE_NAME = "al_athaq_customer_session";

export type CustomerSessionPayload = {
  sub: string;
  email: string;
  role: "customer";
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set (min 16 characters)");
  }
  return secret;
}

export function signCustomerSession(payload: {
  sub: string;
  email: string;
}): string {
  return jwt.sign(
    { ...payload, role: "customer" } satisfies CustomerSessionPayload,
    getJwtSecret(),
    { expiresIn: "14d", issuer: "al-athaq-api" },
  );
}

export function verifyCustomerSession(
  token: string,
): CustomerSessionPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      issuer: "al-athaq-api",
    }) as CustomerSessionPayload;
    if (!decoded?.sub || !decoded?.email || decoded.role !== "customer") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function setCustomerCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  });
}

export function clearCustomerCookie(res: Response) {
  const secure = process.env.NODE_ENV === "production";
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
  });
}

export function readCustomerToken(req: Request): string | null {
  const fromCookie = req.cookies?.[COOKIE_NAME];
  if (typeof fromCookie === "string" && fromCookie.length > 0) return fromCookie;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim() || null;
  }
  return null;
}

export { COOKIE_NAME as CUSTOMER_COOKIE_NAME };
