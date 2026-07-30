import { buildDefaultHomepage } from "@/lib/defaults";
import { mediaTypeFromUrl, resolveOrFallback } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import type {
  FeaturedTileContent,
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

  // Prefer live public files when seeded URLs are missing on disk
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
      // Seeded path not present — fall back to placeholder
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
  // Skip the committed example placeholder so first-run builds stay quiet
  if (url.includes("user:password@localhost")) return false;
  return true;
}

async function fetchFromDatabase(): Promise<HomepageData | null> {
  if (!canUseDatabase()) return null;

  try {
    const [settings, featured, products] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      prisma.featuredTile.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    // Settings + featured still required for a coherent homepage.
    // Products are DB-only: empty catalog is valid (no hardcoded fallbacks).
    if (!settings || featured.length === 0) {
      return null;
    }

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

    const featuredContent: FeaturedTileContent[] = featured.map((tile) => ({
      id: tile.id,
      position: tile.position,
      tag: tile.tag,
      title: tile.title,
      media: toMedia(
        tile.mediaUrl,
        tile.mediaType,
        tile.alt,
        tile.posterUrl,
      ),
      link: tile.link,
      sortOrder: tile.sortOrder,
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
