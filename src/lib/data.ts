import { buildDefaultHomepage } from "@/lib/defaults";
import { mediaTypeFromUrl, resolveOrFallback } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import type {
  FeaturedContent,
  FeaturedSlot,
  HomepageData,
  MediaAsset,
  ProductContent,
  SiteContent,
} from "@/types";

function toMedia(
  mediaUrl: string | null | undefined,
  mediaType: string | undefined,
  alt: string,
  posterUrl?: string | null,
  basenameFallback?: string,
): MediaAsset {
  let url = mediaUrl ?? null;
  let type = (mediaType as MediaAsset["mediaType"]) || "image";

  if (url) {
    const basename =
      url
        .replace(/^\//, "")
        .replace(/^assets\//, "")
        .replace(/\.[^.]+$/, "")
        .split("/")
        .pop() ?? "";
    const resolved = resolveOrFallback(basename);
    if (resolved.mediaUrl) {
      url = resolved.mediaUrl;
      type = resolved.mediaType;
    } else if (!url.startsWith("http")) {
      url = null;
    } else {
      type = mediaTypeFromUrl(url);
    }
  } else if (basenameFallback) {
    const resolved = resolveOrFallback(basenameFallback);
    url = resolved.mediaUrl;
    type = resolved.mediaType;
  }

  return {
    mediaUrl: url,
    mediaType: type,
    posterUrl: posterUrl ?? null,
    alt,
  };
}

function canUseDatabase(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("user:password@localhost")) return false;
  return true;
}

function isFeaturedSlot(n: number): n is FeaturedSlot {
  return n === 1 || n === 2 || n === 3 || n === 4;
}

async function fetchFromDatabase(): Promise<HomepageData | null> {
  if (!canUseDatabase()) return null;

  try {
    const [settings, featured, products] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      prisma.featured.findMany({
        orderBy: { position: "asc" },
        include: { product: true },
      }),
      prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    if (!settings) return null;

    const site: SiteContent = {
      tagline: settings.tagline,
      heroEyebrow: settings.heroEyebrow,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroMedia: toMedia(
        settings.heroMediaUrl,
        settings.heroMediaType,
        "hero-bg",
        settings.heroPosterUrl,
        "hero-bg",
      ),
      ctaPrimaryLabel: settings.ctaPrimaryLabel,
      ctaPrimaryHref: settings.ctaPrimaryHref,
      ctaSecondaryLabel: settings.ctaSecondaryLabel,
      ctaSecondaryHref: settings.ctaSecondaryHref,
      storyHeading: settings.storyHeading,
      storyParagraph1: settings.storyParagraph1,
      storyParagraph2: settings.storyParagraph2,
      storyCtaLabel: settings.storyCtaLabel,
      storyCtaHref: settings.storyCtaHref,
      storyMedia: toMedia(
        settings.storyMediaUrl,
        settings.storyMediaType,
        "us",
        settings.storyPosterUrl,
        "us",
      ),
      storyBg: toMedia(
        settings.storyBgUrl,
        settings.storyBgType,
        "our-story-bg",
        null,
        "our-story-bg",
      ),
    };

    const featuredContent: FeaturedContent[] = featured
      .filter((row) => isFeaturedSlot(row.position))
      .map((row) => ({
        id: row.id,
        position: row.position,
        productId: row.productId,
        slug: row.product.slug,
        name: row.product.name,
        category: row.product.category,
        media: toMedia(
          row.product.mediaUrl,
          row.product.mediaType,
          row.product.alt,
          row.product.posterUrl,
        ),
        link: `#products`,
      }));

    const productContent: ProductContent[] = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      media: toMedia(p.mediaUrl, p.mediaType, p.alt, p.posterUrl),
      sortOrder: p.sortOrder,
    }));

    return {
      settings: site,
      featured: featuredContent,
      products: productContent,
      fromDatabase: true,
    };
  } catch {
    return null;
  }
}

export async function getHomepageData(): Promise<HomepageData> {
  const fromDb = await fetchFromDatabase();
  if (fromDb) return fromDb;
  return buildDefaultHomepage();
}
