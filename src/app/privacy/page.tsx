import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Al Athaq Boutique.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-content px-5 py-16 sm:px-8">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-sm font-medium text-athaq-teal"
      >
        ← Back home
      </Link>
      <h1 className="mt-6 font-display text-4xl text-athaq-ink">Privacy Policy</h1>
      <p className="mt-4 max-w-prose leading-relaxed text-athaq-ink/80">
        Al Athaq Boutique respects your privacy. We only collect information you
        voluntarily provide (such as an email for updates) and use it to respond
        to your request. We do not sell personal data. Contact us to request
        deletion of any information you have shared.
      </p>
    </main>
  );
}
