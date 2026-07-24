/**
 * Normalize NEXT_PUBLIC_SITE_URL for metadataBase / sitemap / OG.
 * Accepts bare hosts like "sahar.theprovenx.com" and adds https://.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    // Strip trailing slash from origin-style URLs for consistent joins
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}
