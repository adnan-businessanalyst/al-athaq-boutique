"use client";

import Link from "next/link";
import { useState } from "react";
import { Media } from "@/components/Media";
import type { FeaturedTileContent } from "@/types";

type FeaturedProps = {
  tiles: FeaturedTileContent[];
};

const positionClass: Record<FeaturedTileContent["position"], string> = {
  LARGE: "md:col-span-1 md:row-span-2 min-h-[320px] md:min-h-[520px]",
  WIDE: "md:col-span-2 min-h-[220px] md:min-h-[250px]",
  SMALL_A: "min-h-[220px] md:min-h-[250px]",
  SMALL_B: "min-h-[220px] md:min-h-[250px]",
};

function Tile({ tile }: { tile: FeaturedTileContent }) {
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

      {/* Always-visible gradient on touch / when revealed; hover on desktop */}
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
          {tile.tag}
        </span>
        <h3 className="font-display text-xl text-athaq-cream sm:text-2xl">
          {tile.title}
        </h3>
        <Link
          href={tile.link}
          className="relative z-20 mt-1 inline-flex min-h-11 items-center rounded-pill bg-athaq-cream px-5 text-sm font-semibold text-athaq-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-cream"
          onFocus={() => setRevealed(true)}
        >
          View
        </Link>
      </div>

      {/* Tap to toggle reveal on coarse pointers (content layer stays clickable) */}
      <button
        type="button"
        className="absolute inset-0 z-[5] md:hidden"
        aria-label={`Reveal details for ${tile.title}`}
        onClick={() => setRevealed((v) => !v)}
      />
    </article>
  );
}

export function Featured({ tiles }: FeaturedProps) {
  const ordered = ["LARGE", "WIDE", "SMALL_A", "SMALL_B"] as const;
  const byPos = Object.fromEntries(tiles.map((t) => [t.position, t])) as Record<
    FeaturedTileContent["position"],
    FeaturedTileContent | undefined
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
            Featured
          </p>
          <h2
            id="featured-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-athaq-ink"
          >
            Chosen for the modern souk
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:gap-5 md:auto-rows-[minmax(240px,1fr)]">
          {ordered.map((pos) => {
            const tile = byPos[pos];
            if (!tile) return null;
            return <Tile key={tile.id} tile={tile} />;
          })}
        </div>
      </div>
    </section>
  );
}
