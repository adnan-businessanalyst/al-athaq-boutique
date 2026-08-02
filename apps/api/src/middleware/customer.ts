import type { NextFunction, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  readCustomerToken,
  verifyCustomerSession,
} from "../lib/customer-auth";
import type { Request } from "express";

export type CustomerAuthedRequest = Request & {
  customer?: { id: string; email: string; name: string | null; phone: string | null };
};

export async function optionalCustomer(
  req: CustomerAuthedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = readCustomerToken(req);
    if (!token) return next();
    const session = verifyCustomerSession(token);
    if (!session) return next();
    const customer = await prisma.customer.findUnique({
      where: { id: session.sub },
    });
    if (customer) {
      req.customer = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
      };
    }
  } catch {
    /* ignore */
  }
  return next();
}

export async function requireCustomer(
  req: CustomerAuthedRequest,
  res: Response,
  next: NextFunction,
) {
  await optionalCustomer(req, res, () => undefined);
  if (!req.customer) {
    return res.status(401).json({ error: "Customer login required" });
  }
  return next();
}
