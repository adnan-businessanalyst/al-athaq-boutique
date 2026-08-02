import { Router } from "express";
import { prisma } from "../lib/prisma";
import { createOrderSchema } from "../lib/validations";
import {
  optionalCustomer,
  type CustomerAuthedRequest,
} from "../middleware/customer";
import { clampQty, formatMoney } from "../lib/money";
import {
  buildWhatsAppDeepLink,
  stubSendOrderConfirmationEmail,
} from "../lib/notify-stubs";

export const ordersRouter = Router();

function parseDeliveryDate(isoDate: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

ordersRouter.post("/", optionalCustomer, async (req: CustomerAuthedRequest, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
  }

  const body = parsed.data;
  const deliveryDate = parseDeliveryDate(body.deliveryDate);
  if (!deliveryDate) {
    return res.status(400).json({ error: "Invalid delivery date" });
  }

  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  if (deliveryDate < todayUtc) {
    return res.status(400).json({ error: "Delivery date cannot be in the past" });
  }

  const zone = await prisma.deliveryZone.findFirst({
    where: { id: body.zoneId, isActive: true },
  });
  if (!zone) {
    return res.status(400).json({ error: "Invalid or inactive delivery zone" });
  }

  const slot = await prisma.deliverySlot.findFirst({
    where: { id: body.slotId, zoneId: zone.id, isActive: true },
  });
  if (!slot) {
    return res.status(400).json({ error: "Invalid or inactive delivery slot" });
  }

  // Location must match zone allowlist
  const cityOk =
    body.address.city.trim().toLowerCase() === zone.city.trim().toLowerCase();
  const countryOk =
    (body.address.country || "SA").toUpperCase() === zone.country.toUpperCase();
  const districtOk =
    !zone.district ||
    (body.address.district || "").trim().toLowerCase() ===
      zone.district.trim().toLowerCase();

  if (!cityOk || !countryOk || !districtOk) {
    return res.status(400).json({
      error: "Address is outside the selected delivery zone",
      code: "ZONE_MISMATCH",
    });
  }

  let email: string;
  let phone: string;
  let fullName: string;
  let customerId: string | null = req.customer?.id ?? null;
  let isGuest = !req.customer;

  if (req.customer) {
    email = req.customer.email;
    phone = body.guest?.phone || req.customer.phone || "";
    fullName = body.guest?.fullName || req.customer.name || "";
    if (!phone || !fullName) {
      return res.status(400).json({
        error: "Logged-in checkout still requires full name and phone",
      });
    }
  } else {
    if (!body.guest) {
      return res.status(400).json({ error: "Guest details required" });
    }
    email = body.guest.email.toLowerCase();
    phone = body.guest.phone;
    fullName = body.guest.fullName;
    isGuest = true;

    // Upsert guest customer shell (no password) for address history
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      customerId = existing.id;
      await prisma.customer.update({
        where: { id: existing.id },
        data: {
          phone: phone || existing.phone,
          name: fullName || existing.name,
        },
      });
    } else {
      const created = await prisma.customer.create({
        data: { email, phone, name: fullName },
      });
      customerId = created.id;
    }
  }

  // Server-priced lines
  const lineInputs = body.items.map((i) => ({
    variantId: i.variantId,
    quantity: clampQty(i.quantity),
  }));

  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: lineInputs.map((l) => l.variantId) },
      isActive: true,
      product: { isActive: true },
    },
    include: { product: true },
  });

  if (variants.length !== lineInputs.length) {
    return res.status(400).json({ error: "One or more cart items are invalid" });
  }

  const byId = new Map(variants.map((v) => [v.id, v]));
  let subtotalHalalas = 0;
  const orderItemsData = lineInputs.map((line) => {
    const v = byId.get(line.variantId)!;
    const unit = v.priceHalalas;
    const lineTotal = unit * line.quantity;
    subtotalHalalas += lineTotal;
    return {
      productId: v.productId,
      variantId: v.id,
      productName: v.product.name,
      productSlug: v.product.slug,
      variantLabel: v.label,
      unitPriceHalalas: unit,
      quantity: line.quantity,
      lineTotalHalalas: lineTotal,
    };
  });

  const shippingFeeHalalas = zone.shippingFeeHalalas;
  const totalHalalas = subtotalHalalas + shippingFeeHalalas;

  const settings = await prisma.commerceSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      purchasePolicy: "Purchase policy placeholder.",
      deliveryInstructions: "Delivery instructions placeholder.",
      orderPrefix: "ATH",
      currencyLabel: "SAR",
    },
    update: {},
  });

  try {
    const order = await prisma.$transaction(async (tx) => {
      const seqRow = await tx.commerceSettings.update({
        where: { id: "default" },
        data: { orderSequence: { increment: 1 } },
      });
      const seq = String(seqRow.orderSequence).padStart(5, "0");
      const ymd = body.deliveryDate.replace(/-/g, "");
      const confirmationNumber = `${settings.orderPrefix}-${ymd}-${seq}`;

      const address = await tx.address.create({
        data: {
          customerId,
          email,
          phone,
          fullName,
          line1: body.address.line1,
          line2: body.address.line2 ?? null,
          city: body.address.city,
          district: body.address.district ?? null,
          country: (body.address.country || "SA").toUpperCase(),
          postalCode: body.address.postalCode ?? null,
          notes: body.address.notes ?? null,
        },
      });

      return tx.order.create({
        data: {
          confirmationNumber,
          customerId,
          addressId: address.id,
          email,
          phone,
          fullName,
          isGuest,
          zoneId: zone.id,
          slotId: slot.id,
          deliveryDate,
          shippingFeeHalalas,
          subtotalHalalas,
          totalHalalas,
          currencyLabel: settings.currencyLabel,
          paymentStatus: "UNPAID",
          fulfillmentStatus: "PENDING",
          locationVerificationStatus: "VERIFIED",
          policyAcceptedAt: new Date(),
          customerNotes: body.customerNotes ?? null,
          items: { create: orderItemsData },
        },
        include: {
          items: true,
          zone: true,
          slot: true,
          address: true,
        },
      });
    });

    const totalLabel = formatMoney(order.totalHalalas, order.currencyLabel);
    const emailStub = await stubSendOrderConfirmationEmail({
      to: order.email,
      confirmationNumber: order.confirmationNumber,
      totalLabel,
    });

    const whatsappUrl = buildWhatsAppDeepLink({
      shopWhatsAppE164: settings.shopWhatsAppE164,
      confirmationNumber: order.confirmationNumber,
      fullName: order.fullName,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        emailStubSentAt: new Date(),
        whatsappStubNote: emailStub.logged,
      },
    });

    return res.status(201).json({
      ok: true,
      order: {
        id: order.id,
        confirmationNumber: order.confirmationNumber,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        locationVerificationStatus: order.locationVerificationStatus,
        subtotalHalalas: order.subtotalHalalas,
        shippingFeeHalalas: order.shippingFeeHalalas,
        totalHalalas: order.totalHalalas,
        currencyLabel: order.currencyLabel,
        deliveryDate: body.deliveryDate,
        zone: order.zone,
        slot: order.slot,
        items: order.items,
        emailStub: { sent: true, note: emailStub.logged },
        whatsappUrl,
      },
    });
  } catch (err) {
    console.error("[orders]", err instanceof Error ? err.message : err);
    return res.status(500).json({ error: "Could not place order" });
  }
});

ordersRouter.get("/confirm/:confirmationNumber", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { confirmationNumber: req.params.confirmationNumber },
    include: {
      items: true,
      zone: true,
      slot: true,
      address: true,
    },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });

  const settings = await prisma.commerceSettings.findUnique({
    where: { id: "default" },
  });
  const whatsappUrl = buildWhatsAppDeepLink({
    shopWhatsAppE164: settings?.shopWhatsAppE164,
    confirmationNumber: order.confirmationNumber,
    fullName: order.fullName,
  });

  return res.json({
    order: {
      confirmationNumber: order.confirmationNumber,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      locationVerificationStatus: order.locationVerificationStatus,
      subtotalHalalas: order.subtotalHalalas,
      shippingFeeHalalas: order.shippingFeeHalalas,
      totalHalalas: order.totalHalalas,
      currencyLabel: order.currencyLabel,
      deliveryDate: order.deliveryDate,
      email: order.email,
      phone: order.phone,
      fullName: order.fullName,
      zone: order.zone,
      slot: order.slot,
      address: order.address,
      items: order.items,
      emailStubSentAt: order.emailStubSentAt,
      whatsappUrl,
    },
  });
});
