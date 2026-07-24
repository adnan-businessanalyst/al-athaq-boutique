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

export function buildDefaultProducts(): ProductContent[] {
  const items: Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
    basename: string;
    sortOrder: number;
  }> = [
    {
      slug: "royal-oud-bakhoor",
      name: "Royal Oud Bakhoor",
      description: "A deep, resinous blend for ceremonial evenings.",
      category: "Incense",
      basename: "product-1",
      sortOrder: 1,
    },
    {
      slug: "amber-rose-incense",
      name: "Amber Rose Incense",
      description: "Warm amber wrapped in soft floral notes.",
      category: "Incense",
      basename: "product-2",
      sortOrder: 2,
    },
    {
      slug: "mashrabiya-lantern",
      name: "Mashrabiya Lantern",
      description: "Pierced metalwork that casts patterned light.",
      category: "Lanterns",
      basename: "product-3",
      sortOrder: 3,
    },
    {
      slug: "souk-textile-runner",
      name: "Souk Textile Runner",
      description: "Handwoven warmth for tables and thresholds.",
      category: "Textiles",
      basename: "product-4",
      sortOrder: 4,
    },
    {
      slug: "crescent-pendant",
      name: "Crescent Pendant",
      description: "A refined everyday talisman in warm metal.",
      category: "Jewelry",
      basename: "product-5",
      sortOrder: 5,
    },
    {
      slug: "desert-musk-set",
      name: "Desert Musk Gift Set",
      description: "Bakhoor and burner, ready to give.",
      category: "Gifts",
      basename: "product-6",
      sortOrder: 6,
    },
    {
      slug: "heritage-scarf",
      name: "Heritage Scarf",
      description: "Light textile with a classic geometric border.",
      category: "Textiles",
      basename: "product-7",
      sortOrder: 7,
    },
  ];

  return items.map((p) => ({
    id: `product-${p.slug}`,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    media: asset(p.basename),
    sortOrder: p.sortOrder,
  }));
}

export function buildDefaultHomepage(): HomepageData {
  return {
    settings: buildDefaultSettings(),
    featured: buildDefaultFeatured(),
    products: buildDefaultProducts(),
    fromDatabase: false,
  };
}
