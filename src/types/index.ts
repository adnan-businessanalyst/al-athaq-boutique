export type MediaKind = "image" | "video" | "svg";

/** Featured slot tags on the homepage bento: 1 large, 2 wide, 3–4 small */
export type FeaturedSlot = 1 | 2 | 3 | 4;

export interface MediaAsset {
  mediaUrl: string | null;
  mediaType: MediaKind;
  posterUrl?: string | null;
  alt: string;
}

export interface SiteContent {
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMedia: MediaAsset;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyCtaLabel: string;
  storyCtaHref: string;
  storyMedia: MediaAsset;
  storyBg: MediaAsset;
}

export interface FeaturedContent {
  id: string;
  position: FeaturedSlot;
  productId: string;
  slug: string;
  name: string;
  category: string;
  media: MediaAsset;
  link: string;
}

export interface ProductVariantContent {
  id: string;
  label: string;
  size: string | null;
  weightGrams: number | null;
  priceHalalas: number;
  quantityAvailable: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductContent {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  media: MediaAsset;
  sortOrder: number;
  variants: ProductVariantContent[];
  defaultVariant: ProductVariantContent | null;
}

export interface HomepageData {
  settings: SiteContent;
  featured: FeaturedContent[];
  products: ProductContent[];
  fromDatabase: boolean;
}
