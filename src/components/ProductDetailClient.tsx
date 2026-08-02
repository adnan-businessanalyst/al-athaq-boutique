"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Media } from "@/components/Media";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";
import type { ProductContent } from "@/types";

export function ProductDetailClient({ product }: { product: ProductContent }) {
  const cart = useCart();
  const initial =
    product.defaultVariant?.id ?? product.variants[0]?.id ?? "";
  const [variantId, setVariantId] = useState(initial);
  const [qty, setQty] = useState(1);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? null,
    [product.variants, variantId],
  );

  return (
    <div className="mx-auto grid max-w-content gap-10 px-5 md:grid-cols-2 md:gap-14">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-athaq-purple/5">
        <Media
          src={product.media.mediaUrl}
          alt={product.media.alt}
          mediaType={product.media.mediaType}
          posterUrl={product.media.posterUrl}
          className="absolute inset-0"
          imgClassName="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-athaq-teal">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-4xl text-athaq-ink md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-lg text-athaq-ink/75">{product.description}</p>
        {product.longDescription ? (
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-athaq-ink/70">
            {product.longDescription}
          </p>
        ) : null}

        {variant ? (
          <p className="mt-6 font-display text-3xl text-athaq-purple">
            {formatMoney(variant.priceHalalas)}
          </p>
        ) : (
          <p className="mt-6 text-athaq-ink/60">Unavailable</p>
        )}

        {product.variants.length > 0 ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Size / weight</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-pill border px-4 py-2 text-sm ${
                    v.id === variantId
                      ? "border-athaq-teal bg-athaq-teal text-white"
                      : "border-athaq-ink/15 bg-white/50"
                  }`}
                >
                  {v.label}
                  {v.size ? ` · ${v.size}` : ""}
                  {v.weightGrams != null ? ` · ${v.weightGrams}g` : ""}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {variant ? (
          <p className="mt-3 text-sm text-athaq-ink/60">
            {variant.quantityAvailable > 0
              ? `${variant.quantityAvailable} in stock`
              : "Out of stock"}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-pill border border-athaq-ink/15 bg-white/70">
            <button
              type="button"
              className="min-h-11 min-w-11 text-lg"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="min-w-8 text-center font-semibold">{qty}</span>
            <button
              type="button"
              className="min-h-11 min-w-11 text-lg"
              onClick={() =>
                setQty((q) =>
                  Math.min(
                    variant?.quantityAvailable
                      ? Math.min(99, variant.quantityAvailable)
                      : 99,
                    q + 1,
                  ),
                )
              }
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={!variant || variant.quantityAvailable < 1}
            className="rounded-pill bg-athaq-purple px-6 py-3 font-semibold text-athaq-cream disabled:opacity-50"
            onClick={() => {
              if (!variant || variant.quantityAvailable < 1) return;
              cart.addItem(
                {
                  variantId: variant.id,
                  productId: product.id,
                  productSlug: product.slug,
                  productName: product.name,
                  variantLabel: variant.label,
                  unitPriceHalalas: variant.priceHalalas,
                  mediaUrl: product.media.mediaUrl,
                },
                Math.min(qty, variant.quantityAvailable),
              );
            }}
          >
            Add to cart
          </button>
          <Link href="/cart" className="text-sm font-medium underline-offset-2 hover:underline">
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
