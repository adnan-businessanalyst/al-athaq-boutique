import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Featured } from "@/components/Featured";
import { OurStory } from "@/components/OurStory";
import { Products } from "@/components/Products";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getHomepageData } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomepageData();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        settings={data.settings}
        products={data.products}
        siteUrl={siteUrl}
      />
      <Nav />
      <main id="main">
        <Hero settings={data.settings} />
        <Featured tiles={data.featured} />
        <OurStory settings={data.settings} />
        <Products products={data.products} />
      </main>
      <Footer />
    </>
  );
}
