"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Media } from "@/components/Media";
import { useLanguage } from "@/components/LanguageProvider";
import type { SiteContent } from "@/types";

type HeroProps = {
  settings: SiteContent;
};

export function Hero({ settings }: HeroProps) {
  const { dict } = useLanguage();
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);

    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const anim = (delay: number) =>
    reduceMotion || !ready
      ? { opacity: ready || reduceMotion ? 1 : 0 }
      : {
          animation: `fly-up 0.75s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
        };

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-hero-fallback" aria-hidden="true" />

      <Media
        src={settings.heroMedia.mediaUrl}
        alt={settings.heroMedia.alt || "hero-bg"}
        mediaType={settings.heroMedia.mediaType}
        posterUrl={settings.heroMedia.posterUrl}
        priority
        autoPlay={!reduceMotion}
        sizes="100vw"
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover"
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-athaq-purple-dark/55 via-athaq-ink/45 to-athaq-ink/70"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-content flex-col items-center px-5 pb-16 pt-28 text-center text-athaq-cream sm:px-8 sm:pt-32">
        <p
          className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-athaq-purple-tint sm:text-sm"
          style={anim(0)}
        >
          {dict.hero.eyebrow}
        </p>

        <h1
          className="font-display text-[clamp(2.35rem,6vw,4.75rem)] leading-[1.08] tracking-tight"
          style={anim(120)}
        >
          <span className="block">{dict.hero.titleLine1}</span>
          <span className="block">{dict.hero.titleLine2}</span>
        </h1>

        <p
          className="mt-5 max-w-xl text-[clamp(0.95rem,2.2vw,1.125rem)] leading-relaxed text-athaq-cream/90"
          style={anim(240)}
        >
          {dict.hero.subtitle}
        </p>

        <div
          className="mt-9 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
          style={anim(360)}
        >
          <Link
            href={settings.ctaPrimaryHref}
            className="inline-flex min-h-12 items-center justify-center rounded-pill bg-athaq-cream px-7 text-sm font-semibold text-athaq-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-cream"
          >
            {dict.hero.ctaPrimary}
          </Link>
          <Link
            href={settings.ctaSecondaryHref}
            className="inline-flex min-h-12 items-center justify-center rounded-pill border border-athaq-cream/80 bg-transparent px-7 text-sm font-semibold text-athaq-cream transition hover:bg-athaq-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-cream"
          >
            {dict.hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
