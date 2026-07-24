import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

type FooterProps = {
  tagline: string;
};

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "#products", label: "All products" },
      { href: "#featured", label: "Featured" },
      { href: "#products", label: "Gift sets" },
    ],
  },
  {
    title: "Boutique",
    links: [
      { href: "#our-story", label: "Our story" },
      { href: "#hero", label: "Visit" },
      { href: "mailto:hello@alathaq.com", label: "Contact" },
    ],
  },
  {
    title: "Follow",
    links: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://pinterest.com", label: "Pinterest" },
      { href: "https://facebook.com", label: "Facebook" },
    ],
  },
] as const;

export function Footer({ tagline }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-footer-gradient text-athaq-cream">
      <div
        className="pointer-events-none absolute inset-0 bg-tile-pattern bg-tile-dot opacity-25"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-16">
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
              {tagline}
            </p>
          </div>

          {COLUMNS.map((col) => (
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
          <p>© {year} Al Athaq Boutique. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
