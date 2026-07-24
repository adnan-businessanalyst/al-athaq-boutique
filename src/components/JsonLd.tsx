import type { ProductContent, SiteContent } from "@/types";

type JsonLdProps = {
  settings: SiteContent;
  products: ProductContent[];
  siteUrl: string;
};

export function JsonLd({ settings, products, siteUrl }: JsonLdProps) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Al Athaq Boutique",
    url: siteUrl,
    slogan: settings.tagline,
    description: settings.heroSubtitle,
    logo: `${siteUrl}/assets/logo.png`,
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    name: "Al Athaq Boutique",
    url: siteUrl,
    description: settings.heroSubtitle,
    image: settings.heroMedia.mediaUrl
      ? settings.heroMedia.mediaUrl.startsWith("http")
        ? settings.heroMedia.mediaUrl
        : `${siteUrl}${settings.heroMedia.mediaUrl}`
      : undefined,
    priceRange: "$$",
    currenciesAccepted: "USD, AED",
    paymentAccepted: "Cash, Credit Card",
  };

  const productList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        category: p.category,
        url: `${siteUrl}/#products`,
        image: p.media.mediaUrl
          ? p.media.mediaUrl.startsWith("http")
            ? p.media.mediaUrl
            : `${siteUrl}${p.media.mediaUrl}`
          : undefined,
        brand: {
          "@type": "Brand",
          name: "Al Athaq Boutique",
        },
      },
    })),
  };

  const payloads = [organization, localBusiness, productList];

  return (
    <>
      {payloads.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
