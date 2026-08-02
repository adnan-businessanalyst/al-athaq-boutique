import { PrismaClient, MediaType } from "@prisma/client";
import { existsSync } from "fs";
import path from "path";
import argon2 from "argon2";

const prisma = new PrismaClient();

const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "gif", "avif"];
const VIDEO_EXTS = ["mp4", "webm", "ogg", "mov"];
const SVG_EXTS = ["svg"];
const ALL_EXTS = [...VIDEO_EXTS, ...SVG_EXTS, ...IMAGE_EXTS];

function resolveSeedMedia(
  basename: string,
  preferredExt = "png",
): { mediaUrl: string; mediaType: MediaType } {
  const publicDir = path.join(process.cwd(), "public");
  const searchRoots = [
    { disk: path.join(publicDir, "assets"), urlPrefix: "/assets" },
    { disk: publicDir, urlPrefix: "" },
  ];
  const ordered = [
    preferredExt,
    ...ALL_EXTS.filter((e) => e !== preferredExt),
  ];

  for (const root of searchRoots) {
    for (const ext of ordered) {
      const filename = `${basename}.${ext}`;
      if (existsSync(path.join(root.disk, filename))) {
        let mediaType: MediaType = MediaType.image;
        if (VIDEO_EXTS.includes(ext)) mediaType = MediaType.video;
        if (SVG_EXTS.includes(ext)) mediaType = MediaType.svg;
        return { mediaUrl: `${root.urlPrefix}/${filename}`, mediaType };
      }
    }
  }

  // Seed the expected default path; runtime falls back to brand placeholders if missing
  return {
    mediaUrl: `/assets/${basename}.${preferredExt}`,
    mediaType: MediaType.image,
  };
}

async function main() {
  const hero = resolveSeedMedia("hero-bg");
  const story = resolveSeedMedia("us");
  const storyBg = resolveSeedMedia("our-story-bg");

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      tagline: "Tradition you can carry home.",
      heroEyebrow: "Incense & Middle Eastern Gifts",
      heroTitle: "Tradition you can\ncarry home.",
      heroSubtitle:
        "Hand-selected bakhoor, lanterns, textiles, and jewelry — crafted to bring the warmth of the souk into your everyday rituals.",
      heroMediaUrl: hero.mediaUrl,
      heroMediaType: hero.mediaType,
      ctaPrimaryLabel: "Discover our story",
      ctaPrimaryHref: "#our-story",
      ctaSecondaryLabel: "Shop the collection",
      ctaSecondaryHref: "#products",
      storyHeading: "Our Story",
      storyParagraph1:
        "Al Athaq Boutique began as a love letter to the scents and craftsmanship of the Middle East — bakhoor that fills a room with memory, lanterns that softens evening light, textiles woven with patience, and jewelry that carries quiet meaning.",
      storyParagraph2:
        "We curate pieces you can gift, keep, and return to: heritage forms rendered for modern homes. Every selection is chosen to feel personal — tradition you can carry home.",
      storyCtaLabel: "Explore the collection",
      storyCtaHref: "#products",
      storyMediaUrl: story.mediaUrl,
      storyMediaType: story.mediaType,
      storyBgUrl: storyBg.mediaUrl,
      storyBgType: storyBg.mediaType,
    },
    update: {
      heroMediaUrl: hero.mediaUrl,
      heroMediaType: hero.mediaType,
      storyMediaUrl: story.mediaUrl,
      storyMediaType: story.mediaType,
      storyBgUrl: storyBg.mediaUrl,
      storyBgType: storyBg.mediaType,
    },
  });

  const products = [
    {
      slug: "royal-oud-bakhoor",
      name: "Royal Oud Bakhoor",
      description: "A deep, resinous blend for ceremonial evenings.",
      longDescription:
        "Our signature Royal Oud Bakhoor is blended for slow, ceremonial burns. Choose a jar size that fits your ritual — small for travel and gifts, large for the home majlis.",
      category: "Incense",
      basename: "product-1",
      sortOrder: 0,
      variants: [
        {
          label: "50g jar",
          size: "Small",
          weightGrams: 50,
          priceHalalas: 8900,
          quantityAvailable: 40,
          isDefault: true,
          sortOrder: 0,
        },
        {
          label: "100g jar",
          size: "Large",
          weightGrams: 100,
          priceHalalas: 14900,
          quantityAvailable: 25,
          isDefault: false,
          sortOrder: 1,
        },
      ],
    },
    {
      slug: "amber-rose-incense",
      name: "Amber Rose Incense",
      description: "Warm amber wrapped in soft floral notes.",
      longDescription: "A soft amber-rose blend suited to evening gatherings.",
      category: "Incense",
      basename: "product-2",
      sortOrder: 1,
      variants: [
        {
          label: "Standard",
          size: "Standard",
          weightGrams: 40,
          priceHalalas: 7500,
          quantityAvailable: 50,
          isDefault: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "mashrabiya-lantern",
      name: "Mashrabiya Lantern",
      description: "Pierced metalwork that casts patterned light.",
      longDescription: "Hand-finished pierced metal that throws patterned light across the room.",
      category: "Lanterns",
      basename: "product-3",
      sortOrder: 2,
      variants: [
        {
          label: "Medium",
          size: "M",
          weightGrams: 800,
          priceHalalas: 22000,
          quantityAvailable: 15,
          isDefault: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "souk-textile-runner",
      name: "Souk Textile Runner",
      description: "Handwoven warmth for tables and thresholds.",
      longDescription: "A woven runner with heritage geometry for tables and entries.",
      category: "Textiles",
      basename: "product-4",
      sortOrder: 3,
      variants: [
        {
          label: "180cm",
          size: "180cm",
          weightGrams: 600,
          priceHalalas: 18500,
          quantityAvailable: 20,
          isDefault: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "crescent-pendant",
      name: "Crescent Pendant",
      description: "A refined everyday talisman in warm metal.",
      longDescription: "Everyday wear with quiet meaning — warm metal, refined finish.",
      category: "Jewelry",
      basename: "product-5",
      sortOrder: 4,
      variants: [
        {
          label: "One size",
          size: "OS",
          weightGrams: 12,
          priceHalalas: 12000,
          quantityAvailable: 30,
          isDefault: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "desert-musk-set",
      name: "Desert Musk Gift Set",
      description: "Bakhoor and burner, ready to give.",
      longDescription: "Gift-ready set with bakhoor and a compact burner.",
      category: "Gifts",
      basename: "product-6",
      sortOrder: 5,
      variants: [
        {
          label: "Gift set",
          size: "Set",
          weightGrams: 450,
          priceHalalas: 19900,
          quantityAvailable: 18,
          isDefault: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "heritage-scarf",
      name: "Heritage Scarf",
      description: "Light textile with a classic geometric border.",
      longDescription: "Light scarf with a classic geometric border — easy to gift.",
      category: "Textiles",
      basename: "product-7",
      sortOrder: 6,
      variants: [
        {
          label: "One size",
          size: "OS",
          weightGrams: 180,
          priceHalalas: 9500,
          quantityAvailable: 35,
          isDefault: true,
          sortOrder: 0,
        },
      ],
    },
  ];

  const seededProductIds: string[] = [];

  for (const p of products) {
    const media = resolveSeedMedia(p.basename);
    const row = await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        longDescription: p.longDescription,
        category: p.category,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        alt: p.basename,
        sortOrder: p.sortOrder,
        isActive: true,
      },
      update: {
        name: p.name,
        description: p.description,
        longDescription: p.longDescription,
        category: p.category,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        alt: p.basename,
        sortOrder: p.sortOrder,
        isActive: true,
      },
    });
    seededProductIds.push(row.id);

    // Replace variants for a clean demo seed
    await prisma.productVariant.deleteMany({ where: { productId: row.id } });
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: row.id,
          label: v.label,
          size: v.size,
          weightGrams: v.weightGrams,
          priceHalalas: v.priceHalalas,
          quantityAvailable: v.quantityAvailable,
          isDefault: v.isDefault,
          isActive: true,
          sortOrder: v.sortOrder,
          sku: `${p.slug}-${v.sortOrder + 1}`,
        },
      });
    }
  }

  // Featured slots 1–4 point at the first four products
  for (let position = 1; position <= 4; position++) {
    const productId = seededProductIds[position - 1];
    if (!productId) break;
    await prisma.featured.upsert({
      where: { position },
      create: { position, productId },
      update: { productId },
    });
  }

  await prisma.commerceSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      purchasePolicy:
        "By placing an order you confirm that product details, delivery fees, and timing are understood. Orders are confirmed without online payment in this demo — our team may contact you to arrange payment.",
      deliveryInstructions:
        "We deliver only within listed zones. Please ensure someone is available during your chosen slot. Apartment/villa number and a reachable mobile number are required. Drivers may call on arrival.",
      shippingPolicy:
        "Shipping is available only to active delivery zones. Method fees plus any zone surcharge apply. Estimated arrival windows are shown per method and zone; delays due to weather or access issues may occur.",
      returnPolicy:
        "Unused items in original packaging may be returned within 7 days of delivery where permitted by Saudi consumer law. Personalized or opened fragrance goods may be non-returnable. Contact us with your confirmation number to start a return.",
      orderPrefix: "ATH",
      shopWhatsAppE164: "+966500000000",
      currencyLabel: "SAR",
      orderSequence: 0,
    },
    update: {
      purchasePolicy:
        "By placing an order you confirm that product details, delivery fees, and timing are understood. Orders are confirmed without online payment in this demo — our team may contact you to arrange payment.",
      deliveryInstructions:
        "We deliver only within listed zones. Please ensure someone is available during your chosen slot. Apartment/villa number and a reachable mobile number are required. Drivers may call on arrival.",
      shippingPolicy:
        "Shipping is available only to active delivery zones. Method fees plus any zone surcharge apply. Estimated arrival windows are shown per method and zone; delays due to weather or access issues may occur.",
      returnPolicy:
        "Unused items in original packaging may be returned within 7 days of delivery where permitted by Saudi consumer law. Personalized or opened fragrance goods may be non-returnable. Contact us with your confirmation number to start a return.",
      shopWhatsAppE164: "+966500000000",
      currencyLabel: "SAR",
    },
  });

  const shippingMethods = [
    {
      name: "Standard delivery",
      description: "Scheduled slot delivery within your zone.",
      feeHalalas: 1500,
      etaLabel: "Uses zone lead time",
      sortOrder: 0,
    },
    {
      name: "Express delivery",
      description: "Priority handling when capacity allows.",
      feeHalalas: 3500,
      etaLabel: "Faster when available",
      sortOrder: 1,
    },
  ];
  for (const m of shippingMethods) {
    const existing = await prisma.shippingMethod.findFirst({
      where: { name: m.name },
    });
    if (existing) {
      await prisma.shippingMethod.update({
        where: { id: existing.id },
        data: {
          description: m.description,
          feeHalalas: m.feeHalalas,
          etaLabel: m.etaLabel,
          isActive: true,
          sortOrder: m.sortOrder,
        },
      });
    } else {
      await prisma.shippingMethod.create({
        data: { ...m, isActive: true },
      });
    }
  }

  // Delivery zones + slots (replace demo rows by name)
  const zoneDefs = [
    {
      name: "Riyadh — Central",
      country: "SA",
      city: "Riyadh",
      district: "Olaya",
      shippingFeeHalalas: 2500,
      leadTimeDaysMin: 1,
      leadTimeDaysMax: 2,
      etaLabel: "1–2 days",
      slots: [
        { label: "Morning 9:00–12:00", startTime: "09:00", endTime: "12:00", sortOrder: 0 },
        { label: "Afternoon 13:00–17:00", startTime: "13:00", endTime: "17:00", sortOrder: 1 },
        { label: "Evening 18:00–21:00", startTime: "18:00", endTime: "21:00", sortOrder: 2 },
      ],
    },
    {
      name: "Jeddah — Corniche",
      country: "SA",
      city: "Jeddah",
      district: "Corniche",
      shippingFeeHalalas: 3500,
      leadTimeDaysMin: 2,
      leadTimeDaysMax: 4,
      etaLabel: "2–4 days",
      slots: [
        { label: "Morning 10:00–13:00", startTime: "10:00", endTime: "13:00", sortOrder: 0 },
        { label: "Afternoon 14:00–18:00", startTime: "14:00", endTime: "18:00", sortOrder: 1 },
      ],
    },
  ];

  for (const z of zoneDefs) {
    const existing = await prisma.deliveryZone.findFirst({
      where: { name: z.name },
    });
    const zone = existing
      ? await prisma.deliveryZone.update({
          where: { id: existing.id },
          data: {
            country: z.country,
            city: z.city,
            district: z.district,
            isActive: true,
            shippingFeeHalalas: z.shippingFeeHalalas,
            leadTimeDaysMin: z.leadTimeDaysMin,
            leadTimeDaysMax: z.leadTimeDaysMax,
            etaLabel: z.etaLabel,
          },
        })
      : await prisma.deliveryZone.create({
          data: {
            name: z.name,
            country: z.country,
            city: z.city,
            district: z.district,
            isActive: true,
            shippingFeeHalalas: z.shippingFeeHalalas,
            leadTimeDaysMin: z.leadTimeDaysMin,
            leadTimeDaysMax: z.leadTimeDaysMax,
            etaLabel: z.etaLabel,
          },
        });

    await prisma.deliverySlot.deleteMany({ where: { zoneId: zone.id } });
    for (const s of z.slots) {
      await prisma.deliverySlot.create({
        data: {
          zoneId: zone.id,
          label: s.label,
          startTime: s.startTime,
          endTime: s.endTime,
          sortOrder: s.sortOrder,
          isActive: true,
        },
      });
    }
  }

  // Bootstrap admin from env (hashed — never store plaintext)
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (adminEmail && bootstrapPassword) {
    const existing = await prisma.adminUser.findUnique({
      where: { email: adminEmail },
    });
    if (!existing) {
      const passwordHash = await argon2.hash(bootstrapPassword, {
        type: argon2.argon2id,
      });
      await prisma.adminUser.create({
        data: {
          email: adminEmail,
          passwordHash,
          passwordChangedAt: new Date(),
        },
      });
      console.log(`Admin user seeded for ${adminEmail} (password hashed).`);
    } else {
      console.log(`Admin user already exists for ${adminEmail}; skipping bootstrap.`);
    }
  } else {
    console.warn(
      "ADMIN_EMAIL / ADMIN_BOOTSTRAP_PASSWORD not set — skipped AdminUser seed.",
    );
  }

  console.log(
    "Seed complete: SiteSettings, Products+Variants, Featured, CommerceSettings, Zones/Slots, AdminUser.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
