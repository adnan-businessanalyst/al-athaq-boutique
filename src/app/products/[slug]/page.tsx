import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { mediaTypeFromUrl, resolveOrFallback } from "@/lib/media";
import type { MediaAsset, ProductContent } from "@/types";

export const revalidate = 60;

type Props = { params: { slug: string } };

function toMedia(
  mediaUrl: string,
  mediaType: string,
  alt: string,
  posterUrl?: string | null,
): MediaAsset {
  let url: string | null = mediaUrl;
  let type = (mediaType as MediaAsset["mediaType"]) || "image";
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
    type = resolved.mediaType as MediaAsset["mediaType"];
  } else if (!url.startsWith("http")) {
    url = null;
  } else {
    type = mediaTypeFromUrl(url) as MediaAsset["mediaType"];
  }
  return { mediaUrl: url, mediaType: type, posterUrl: posterUrl ?? null, alt };
}

async function getProduct(slug: string): Promise<ProductContent | null> {
  try {
    const p = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      },
    });
    if (!p) return null;
    const variants = p.variants.map((v) => ({
      id: v.id,
      label: v.label,
      size: v.size,
      weightGrams: v.weightGrams,
      priceHalalas: v.priceHalalas,
      quantityAvailable: v.quantityAvailable,
      isDefault: v.isDefault,
      isActive: v.isActive,
      sortOrder: v.sortOrder,
    }));
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      longDescription: p.longDescription,
      category: p.category,
      media: toMedia(p.mediaUrl, p.mediaType, p.alt, p.posterUrl),
      sortOrder: p.sortOrder,
      variants,
      defaultVariant: variants.find((v) => v.isDefault) ?? variants[0] ?? null,
    };
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      <Nav />
      <main className="bg-athaq-cream pt-28 pb-16">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
