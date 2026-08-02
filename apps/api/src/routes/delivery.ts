import { Router } from "express";
import { prisma } from "../lib/prisma";
import { deliveryValidateSchema } from "../lib/validations";

export const deliveryRouter = Router();

deliveryRouter.get("/zones", async (_req, res) => {
  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      slots: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return res.json({ zones });
});

deliveryRouter.get("/zones/:zoneId/slots", async (req, res) => {
  const zone = await prisma.deliveryZone.findFirst({
    where: { id: req.params.zoneId, isActive: true },
  });
  if (!zone) return res.status(404).json({ error: "Zone not found" });

  const slots = await prisma.deliverySlot.findMany({
    where: { zoneId: zone.id, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return res.json({ zone, slots });
});

deliveryRouter.post("/validate", async (req, res) => {
  const parsed = deliveryValidateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid location payload" });
  }

  const { country, city, district } = parsed.data;
  const cityNorm = city.trim().toLowerCase();
  const districtNorm = district?.trim().toLowerCase() || null;

  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true, country: country.toUpperCase() },
    include: {
      slots: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  const matches = zones.filter((z) => {
    if (z.city.trim().toLowerCase() !== cityNorm) return false;
    if (!z.district) return true;
    if (!districtNorm) return false;
    return z.district.trim().toLowerCase() === districtNorm;
  });

  if (matches.length === 0) {
    return res.json({
      ok: false,
      verified: false,
      message: "Delivery is not available for this location.",
      zones: [],
    });
  }

  return res.json({
    ok: true,
    verified: true,
    message: "Location matches an active delivery zone.",
    zones: matches,
  });
});
