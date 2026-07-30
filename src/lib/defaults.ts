import type {
  FeaturedTileContent,
  HomepageData,
  MediaAsset,
  ProductContent,
  SiteContent,
} from "@/types";
import { resolveOrFallback } from "@/lib/media";
import type { MediaKind } from "@/types";

/** Resolve from public/assets; always return a concrete /assets URL when the file exists. */
function asset(basename: string): MediaAsset {
  const resolved = resolveOrFallback(basename);
  return {
    mediaUrl: resolved.mediaUrl,
    mediaType: resolved.mediaType as MediaKind,
    posterUrl: null,
    alt: basename,
  };
}

export function buildDefaultSettings(): SiteContent {
  const hero = asset("hero-bg");
  const story = asset("us");
  const storyBg = asset("our-story-bg");

  return {
    tagline: "Tradition you can carry home.",
    heroEyebrow: "Incense & Middle Eastern Gifts",
    heroTitle: "Tradition you can\ncarry home.",
    heroSubtitle:
      "Hand-selected bakhoor, lanterns, textiles, and jewelry — crafted to bring the warmth of the souk into your everyday rituals.",
    heroMedia: hero,
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
    storyMedia: story,
    storyBg,
  };
}

export function buildDefaultFeatured(): FeaturedTileContent[] {
  const tiles: Array<{
    position: FeaturedTileContent["position"];
    tag: string;
    title: string;
    basename: string;
    link: string;
    sortOrder: number;
  }> = [
    {
      position: "LARGE",
      tag: "Bakhoor",
      title: "Signature incense blends",
      basename: "product-1",
      link: "#products",
      sortOrder: 0,
    },
    {
      position: "WIDE",
      tag: "Lanterns",
      title: "Light for evening rituals",
      basename: "product-2",
      link: "#products",
      sortOrder: 1,
    },
    {
      position: "SMALL_A",
      tag: "Textiles",
      title: "Soft heritage weaves",
      basename: "product-3",
      link: "#products",
      sortOrder: 2,
    },
    {
      position: "SMALL_B",
      tag: "Jewelry",
      title: "Pieces with quiet meaning",
      basename: "product-4",
      link: "#products",
      sortOrder: 3,
    },
  ];

  return tiles.map((t) => ({
    id: `featured-${t.position.toLowerCase()}`,
    position: t.position,
    tag: t.tag,
    title: t.title,
    media: asset(t.basename),
    link: t.link,
    sortOrder: t.sortOrder,
  }));
}

/** Products are database-driven only — never hardcode a live catalog. */
export function buildDefaultProducts(): ProductContent[] {
  return [];
}

export function buildDefaultHomepage(): HomepageData {
  return {
    settings: buildDefaultSettings(),
    featured: buildDefaultFeatured(),
    products: [],
    fromDatabase: false,
  };
}
