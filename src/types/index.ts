export type MediaKind = "image" | "video" | "svg";

export type FeaturedPosition = "LARGE" | "WIDE" | "SMALL_A" | "SMALL_B";

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

export interface FeaturedTileContent {
  id: string;
  position: FeaturedPosition;
  tag: string;
  title: string;
  media: MediaAsset;
  link: string;
  sortOrder: number;
}

export interface ProductContent {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  media: MediaAsset;
  sortOrder: number;
}

export interface HomepageData {
  settings: SiteContent;
  featured: FeaturedTileContent[];
  products: ProductContent[];
  fromDatabase: boolean;
}
