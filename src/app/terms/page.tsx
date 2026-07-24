import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Al Athaq Boutique.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-content px-5 py-16 sm:px-8">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-sm font-medium text-athaq-teal"
      >
        ← Back home
      </Link>
      <h1 className="mt-6 font-display text-4xl text-athaq-ink">Terms of Use</h1>
      <p className="mt-4 max-w-prose leading-relaxed text-athaq-ink/80">
        By using the Al Athaq Boutique website, you agree to use it for lawful
        purposes only. Product descriptions are for informational purposes;
        availability and details may change. All brand marks and site content
        belong to Al Athaq Boutique unless otherwise noted.
      </p>
    </main>
  );
}
