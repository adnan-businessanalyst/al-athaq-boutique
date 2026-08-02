import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import {
  clearCustomerCookie,
  setCustomerCookie,
  signCustomerSession,
} from "../lib/customer-auth";
import {
  customerLoginSchema,
  customerRegisterSchema,
} from "../lib/validations";
import {
  optionalCustomer,
  requireCustomer,
  type CustomerAuthedRequest,
} from "../middleware/customer";
import { loginRateLimit } from "../middleware/rateLimit";

export const customerRouter = Router();

customerRouter.post("/register", loginRateLimit, async (req, res) => {
  const parsed = customerRegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid registration payload" });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return res.status(409).json({ error: "An account with this email exists" });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const customer = existing
    ? await prisma.customer.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          name: parsed.data.name ?? existing.name,
          phone: parsed.data.phone ?? existing.phone,
        },
      })
    : await prisma.customer.create({
        data: {
          email,
          passwordHash,
          name: parsed.data.name,
          phone: parsed.data.phone,
        },
      });

  const token = signCustomerSession({ sub: customer.id, email: customer.email });
  setCustomerCookie(res, token);
  return res.status(201).json({
    ok: true,
    token,
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
    },
  });
});

customerRouter.post("/login", loginRateLimit, async (req, res) => {
  const parsed = customerLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid login payload" });
  }

  const email = parsed.data.email.toLowerCase();
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer?.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const ok = await verifyPassword(customer.passwordHash, parsed.data.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signCustomerSession({ sub: customer.id, email: customer.email });
  setCustomerCookie(res, token);
  return res.json({
    ok: true,
    token,
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
    },
  });
});

customerRouter.post("/logout", (_req, res) => {
  clearCustomerCookie(res);
  return res.json({ ok: true });
});

customerRouter.get(
  "/me",
  optionalCustomer,
  async (req: CustomerAuthedRequest, res) => {
    if (!req.customer) {
      return res.json({ customer: null });
    }
    return res.json({ customer: req.customer });
  },
);

customerRouter.get(
  "/addresses",
  requireCustomer,
  async (req: CustomerAuthedRequest, res) => {
    const addresses = await prisma.address.findMany({
      where: { customerId: req.customer!.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return res.json({ addresses });
  },
);
