"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { dict } = useLanguage();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: dict.footer.shop,
      links: [
        { href: "#products", label: dict.footer.allProducts },
        { href: "#featured", label: dict.footer.featured },
        { href: "#products", label: dict.footer.giftSets },
      ],
    },
    {
      title: dict.footer.boutique,
      links: [
        { href: "#our-story", label: dict.footer.ourStory },
        { href: "#hero", label: dict.footer.visit },
        { href: "mailto:hello@alathaq.com", label: dict.footer.contact },
      ],
    },
    {
      title: dict.footer.follow,
      links: [
        { href: "https://instagram.com", label: "Instagram" },
        { href: "https://pinterest.com", label: "Pinterest" },
        { href: "https://facebook.com", label: "Facebook" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden text-athaq-cream">
      {/* Full-bleed tribal pattern */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/footer-bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Black overlay — 85% transparent */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/90"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] md:gap-8">
          <div>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-purple-tint"
              aria-label="Al Athaq Boutique home"
            >
              <BrandLogo size="footer" className="shadow-md ring-1 ring-white/15" />
            </Link>
            <p className="mt-4 max-w-xs font-display text-lg text-athaq-purple-tint">
              {dict.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-athaq-purple-tint">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-athaq-cream/90 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-purple-tint"
                      {...(link.href.startsWith("http")
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-athaq-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Al Athaq Boutique. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              {dict.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              {dict.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
