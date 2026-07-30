"use client";

import Link from "next/link";
import { useState } from "react";
import { Media } from "@/components/Media";
import { useLanguage } from "@/components/LanguageProvider";
import type { FeaturedContent, FeaturedSlot } from "@/types";

type FeaturedProps = {
  tiles: FeaturedContent[];
};

const positionClass: Record<FeaturedSlot, string> = {
  1: "md:col-span-1 md:row-span-2 min-h-[320px] md:min-h-[520px]",
  2: "md:col-span-2 min-h-[220px] md:min-h-[250px]",
  3: "min-h-[220px] md:min-h-[250px]",
  4: "min-h-[220px] md:min-h-[250px]",
};

function Tile({
  tile,
  tag,
  title,
  viewLabel,
}: {
  tile: FeaturedContent;
  tag: string;
  title: string;
  viewLabel: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl ${positionClass[tile.position]}`}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
    >
      <Media
        src={tile.media.mediaUrl}
        alt={tile.media.alt}
        mediaType={tile.media.mediaType}
        posterUrl={tile.media.posterUrl}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
        className="absolute inset-0"
        imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-athaq-purple-dark/90 via-athaq-purple/40 to-transparent transition-opacity duration-300 ${
          revealed
            ? "opacity-100"
            : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col items-start gap-2 p-5 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          revealed
            ? "translate-y-0"
            : "translate-y-0 md:translate-y-4 md:group-hover:translate-y-0"
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-athaq-purple-tint">
          {tag}
        </span>
        <h3 className="font-display text-xl text-athaq-cream sm:text-2xl">
          {title}
        </h3>
        <Link
          href={tile.link}
          className="relative z-20 mt-1 inline-flex min-h-11 items-center rounded-pill bg-athaq-cream px-5 text-sm font-semibold text-athaq-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-cream"
          onFocus={() => setRevealed(true)}
        >
          {viewLabel}
        </Link>
      </div>

      <button
        type="button"
        className="absolute inset-0 z-[5] md:hidden"
        aria-label={title}
        onClick={() => setRevealed((v) => !v)}
      />
    </article>
  );
}

export function Featured({ tiles }: FeaturedProps) {
  const { dict } = useLanguage();
  const ordered: FeaturedSlot[] = [1, 2, 3, 4];
  const byPos = Object.fromEntries(tiles.map((t) => [t.position, t])) as Record<
    FeaturedSlot,
    FeaturedContent | undefined
  >;

  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="relative bg-athaq-cream px-5 py-[clamp(3.5rem,8vw,6.5rem)] sm:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-tile-pattern bg-tile-dot opacity-60"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-content">
        <div className="mb-8 max-w-xl sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-athaq-teal">
            {dict.featured.eyebrow}
          </p>
          <h2
            id="featured-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-athaq-ink"
          >
            {dict.featured.heading}
          </h2>
        </div>

        {tiles.length === 0 ? (
          <p className="rounded-3xl border border-athaq-ink/10 bg-white/40 px-6 py-10 text-athaq-ink/70">
            Featured pieces will appear here once products are tagged in slots
            1–4.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:gap-5 md:auto-rows-[minmax(240px,1fr)]">
            {ordered.map((pos) => {
              const tile = byPos[pos];
              if (!tile) return null;
              const copy = dict.products.items[tile.slug] ?? {
                name: tile.name,
                category: tile.category,
              };
              return (
                <Tile
                  key={tile.id}
                  tile={tile}
                  tag={copy.category}
                  title={copy.name}
                  viewLabel={dict.featured.view}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
