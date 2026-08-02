"use client";

import Link from "next/link";
import { Media } from "@/components/Media";
import { DiamondMotif } from "@/components/DiamondMotif";
import { useLanguage } from "@/components/LanguageProvider";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";
import type { ProductContent } from "@/types";

type ProductsProps = {
  products: ProductContent[];
};

export function Products({ products }: ProductsProps) {
  const { dict } = useLanguage();
  const cart = useCart();

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="relative bg-athaq-cream px-5 py-[clamp(3.5rem,8vw,6.5rem)] sm:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-tile-pattern bg-tile-dot opacity-50"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-content">
        <div className="mb-8 max-w-xl sm:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-athaq-teal">
            {dict.products.eyebrow}
          </p>
          <h2
            id="products-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-athaq-ink"
          >
            {dict.products.heading}
          </h2>
          <p className="mt-3 text-base text-athaq-ink/75 sm:text-lg">
            {dict.products.subtitle}
          </p>
        </div>

        {products.length === 0 ? (
          <p className="rounded-3xl border border-athaq-ink/10 bg-white/40 px-6 py-10 text-athaq-ink/70">
            The collection is being curated. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {products.map((product) => {
              const copy = dict.products.items[product.slug] ?? {
                name: product.name,
                description: product.description,
                category: product.category,
              };
              const variant = product.defaultVariant;
              const inCart = variant
                ? cart.lines.find((l) => l.variantId === variant.id)?.quantity ??
                  0
                : 0;

              return (
                <li key={product.id}>
                  <article className="group flex h-full flex-col">
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-athaq-purple/5"
                    >
                      <Media
                        src={product.media.mediaUrl}
                        alt={product.media.alt}
                        mediaType={product.media.mediaType}
                        posterUrl={product.media.posterUrl}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="absolute inset-0"
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <DiamondMotif
                        size={36}
                        tone="light"
                        className="pointer-events-none absolute end-3 top-3 opacity-80"
                      />
                      <span className="absolute start-3 top-3 rounded-pill bg-athaq-cream/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-athaq-ink backdrop-blur-sm">
                        {copy.category}
                      </span>
                    </Link>
                    <div className="mt-4 flex flex-1 flex-col">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-display text-xl text-athaq-ink hover:text-athaq-purple">
                          {copy.name}
                        </h3>
                      </Link>
                      <p className="mt-1.5 text-sm leading-relaxed text-athaq-ink/70">
                        {copy.description}
                      </p>
                      {variant ? (
                        <p className="mt-2 text-sm font-semibold text-athaq-teal">
                          {formatMoney(variant.priceHalalas)}
                          {product.variants.length > 1 ? (
                            <span className="font-normal text-athaq-ink/50">
                              {" "}
                              · {variant.label}
                            </span>
                          ) : null}
                        </p>
                      ) : null}

                      {variant ? (
                        <div className="mt-4 flex items-center gap-2">
                          {inCart > 0 ? (
                            <div className="inline-flex items-center rounded-pill border border-athaq-ink/15 bg-white/60">
                              <button
                                type="button"
                                className="min-h-10 min-w-10 text-lg"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  cart.setQty(variant.id, inCart - 1)
                                }
                              >
                                −
                              </button>
                              <span className="min-w-8 text-center text-sm font-semibold">
                                {inCart}
                              </span>
                              <button
                                type="button"
                                className="min-h-10 min-w-10 text-lg"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  cart.setQty(variant.id, inCart + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="rounded-pill bg-athaq-purple px-4 py-2 text-sm font-semibold text-athaq-cream"
                              onClick={() =>
                                cart.addItem({
                                  variantId: variant.id,
                                  productId: product.id,
                                  productSlug: product.slug,
                                  productName: product.name,
                                  variantLabel: variant.label,
                                  unitPriceHalalas: variant.priceHalalas,
                                  mediaUrl: product.media.mediaUrl,
                                })
                              }
                            >
                              Add to cart
                            </button>
                          )}
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-sm font-medium text-athaq-ink/60 underline-offset-2 hover:underline"
                          >
                            Details
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
