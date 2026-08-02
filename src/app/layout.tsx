import type { Metadata, Viewport } from "next";
import { Marcellus, Work_Sans } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CartProvider } from "@/components/CartProvider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Al Athaq Boutique | Tradition you can carry home",
    template: "%s | Al Athaq Boutique",
  },
  description:
    "Al Athaq Boutique — a heritage-modern gift boutique specializing in incense, bakhoor, lanterns, textiles, and Middle Eastern gifts. Tradition you can carry home.",
  applicationName: "Al Athaq Boutique",
  keywords: [
    "Al Athaq Boutique",
    "bakhoor",
    "incense",
    "Middle Eastern gifts",
    "lanterns",
    "textiles",
    "jewelry",
    "gift boutique",
  ],
  authors: [{ name: "Al Athaq Boutique" }],
  creator: "Al Athaq Boutique",
  publisher: "Al Athaq Boutique",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/assets/logo.png", type: "image/png" }],
    apple: [{ url: "/assets/logo.png", type: "image/png" }],
    shortcut: "/assets/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Al Athaq Boutique",
    title: "Al Athaq Boutique | Tradition you can carry home",
    description:
      "Hand-selected bakhoor, lanterns, textiles, and jewelry — heritage warmth for modern homes.",
    images: [
      {
        url: "/assets/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "hero-bg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Athaq Boutique | Tradition you can carry home",
    description:
      "Hand-selected bakhoor, lanterns, textiles, and jewelry — heritage warmth for modern homes.",
    images: ["/assets/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#6C3FA4",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${marcellus.variable} ${workSans.variable}`}>
      <body className="min-h-screen bg-athaq-cream font-sans text-athaq-ink antialiased">
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
