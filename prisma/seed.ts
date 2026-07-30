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
      category: "Incense",
      basename: "product-1",
      sortOrder: 0,
    },
    {
      slug: "amber-rose-incense",
      name: "Amber Rose Incense",
      description: "Warm amber wrapped in soft floral notes.",
      category: "Incense",
      basename: "product-2",
      sortOrder: 1,
    },
    {
      slug: "mashrabiya-lantern",
      name: "Mashrabiya Lantern",
      description: "Pierced metalwork that casts patterned light.",
      category: "Lanterns",
      basename: "product-3",
      sortOrder: 2,
    },
    {
      slug: "souk-textile-runner",
      name: "Souk Textile Runner",
      description: "Handwoven warmth for tables and thresholds.",
      category: "Textiles",
      basename: "product-4",
      sortOrder: 3,
    },
    {
      slug: "crescent-pendant",
      name: "Crescent Pendant",
      description: "A refined everyday talisman in warm metal.",
      category: "Jewelry",
      basename: "product-5",
      sortOrder: 4,
    },
    {
      slug: "desert-musk-set",
      name: "Desert Musk Gift Set",
      description: "Bakhoor and burner, ready to give.",
      category: "Gifts",
      basename: "product-6",
      sortOrder: 5,
    },
    {
      slug: "heritage-scarf",
      name: "Heritage Scarf",
      description: "Light textile with a classic geometric border.",
      category: "Textiles",
      basename: "product-7",
      sortOrder: 6,
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
        category: p.category,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        alt: p.basename,
        sortOrder: p.sortOrder,
      },
      update: {
        name: p.name,
        description: p.description,
        category: p.category,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        alt: p.basename,
        sortOrder: p.sortOrder,
      },
    });
    seededProductIds.push(row.id);
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

  console.log("Seed complete: SiteSettings, Products, Featured, AdminUser.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
