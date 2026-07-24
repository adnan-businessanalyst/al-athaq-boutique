"use client";

import Link from "next/link";
import { Media } from "@/components/Media";
import { DiamondMotif } from "@/components/DiamondMotif";
import { useLanguage } from "@/components/LanguageProvider";
import type { SiteContent } from "@/types";

type OurStoryProps = {
  settings: SiteContent;
};

export function OurStory({ settings }: OurStoryProps) {
  const { dict } = useLanguage();

  return (
    <section
      id="our-story"
      aria-labelledby="story-heading"
      className="relative overflow-hidden px-5 py-[clamp(3.5rem,8vw,6.5rem)] sm:px-8"
    >
      <div className="absolute inset-0 bg-story-fallback" aria-hidden="true" />
      <Media
        src={settings.storyBg.mediaUrl}
        alt={settings.storyBg.alt || "our-story-bg"}
        mediaType={settings.storyBg.mediaType}
        className="absolute inset-0"
        imgClassName="object-cover object-center"
        sizes="100vw"
        priority
      />
      <div
        className="absolute inset-0 bg-athaq-purple-dark/55"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-content items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-athaq-cream/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/15">
            <Media
              src={settings.storyMedia.mediaUrl}
              alt={settings.storyMedia.alt}
              mediaType={settings.storyMedia.mediaType}
              posterUrl={settings.storyMedia.posterUrl}
              sizes="(max-width: 1024px) 90vw, 480px"
              className="absolute inset-0"
              imgClassName="object-cover object-center"
              autoPlay
              fallbackGradient="radial-gradient(100% 100% at 30% 20%, #5a3488, #4E2A7A 50%, #2b1a4d)"
            />
          </div>
          <DiamondMotif
            size={56}
            tone="light"
            className="absolute -end-2 -top-2 sm:-end-4 sm:-top-4"
          />
        </div>

        <div className="text-athaq-cream">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-athaq-purple-tint">
            {dict.story.eyebrow}
          </p>
          <h2
            id="story-heading"
            className="font-display text-[clamp(1.85rem,4vw,2.85rem)] leading-tight"
          >
            {dict.story.heading}
          </h2>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-athaq-cream/90 sm:text-lg">
            {dict.story.p1}
          </p>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-athaq-cream/85 sm:text-lg">
            {dict.story.p2}
          </p>
          <Link
            href={settings.storyCtaHref}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-pill bg-athaq-teal px-7 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-teal"
          >
            {dict.story.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
