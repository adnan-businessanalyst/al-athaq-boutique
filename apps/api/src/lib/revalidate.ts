/**
 * Ask the Next.js storefront to revalidate the homepage after product CRUD.
 * Configure NEXT_REVALIDATE_URL (e.g. https://site.com/api/revalidate)
 * and REVALIDATE_SECRET on both apps.
 */
export async function triggerStorefrontRevalidate(): Promise<void> {
  const url = process.env.NEXT_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ secret }),
    });
  } catch (err) {
    console.warn(
      "[revalidate]",
      err instanceof Error ? err.message : "failed",
    );
  }
}
