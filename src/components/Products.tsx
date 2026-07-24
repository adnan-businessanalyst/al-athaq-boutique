import { Media } from "@/components/Media";
import { DiamondMotif } from "@/components/DiamondMotif";
import type { ProductContent } from "@/types";

type ProductsProps = {
  products: ProductContent[];
};

export function Products({ products }: ProductsProps) {
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
            Collection
          </p>
          <h2
            id="products-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-athaq-ink"
          >
            Gifts to carry home
          </h2>
          <p className="mt-3 text-base text-athaq-ink/75 sm:text-lg">
            Bakhoor, lanterns, textiles, and jewelry — curated with heritage warmth.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {products.map((product) => (
            <li key={product.id}>
              <article className="group flex h-full flex-col">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-athaq-purple/5">
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
                    className="pointer-events-none absolute right-3 top-3 opacity-80"
                  />
                  <span className="absolute left-3 top-3 rounded-pill bg-athaq-cream/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-athaq-ink backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="font-display text-xl text-athaq-ink">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-athaq-ink/70">
                    {product.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
