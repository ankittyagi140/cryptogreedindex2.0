import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import Script from "next/script";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import Providers from "./providers";

import "./globals.css";
import AdSenseBannerDeferred from "@/components/AdSenseBannerDeferred";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cryptogreedindex.com"),
  title: {
    default: "Crypto Greed Index | Real-Time Crypto Sentiment & Market Heatmaps",
    template: "%s | Crypto Greed Index",
  },
  description:
    "Crypto Greed Index delivers real-time fear and greed analytics, global crypto market data, and top gainers/losers dashboards to help investors make smarter decisions.",
  keywords: [
    "crypto fear and greed index",
    "bitcoin greed index",
    "crypto market sentiment",
    "cryptocurrency analytics",
    "crypto market cap",
    "bitcoin dominance",
    "crypto top gainers",
    "crypto top losers",
    "crypto greed index",
  ],
  applicationName: "Crypto Greed Index",
  authors: [{ name: "CryptoGreedIndex.com" }],
  category: "Finance",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/cryptogreedindex-logo.png",
    shortcut: "/cryptogreedindex-logo.png",
    apple: "/cryptogreedindex-logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.cryptogreedindex.com",
    siteName: "Crypto Greed Index",
    title: "Crypto Greed Index | Real-Time Crypto Sentiment & Market Heatmaps",
    description:
      "Monitor the latest crypto fear and greed score, global market capitalization, bitcoin dominance, and top movers with live data refreshed throughout the day.",
    images: [
      {
        url: "https://www.cryptogreedindex.com/cryptogreedindex-logo.png",
        width: 1200,
        height: 630,
        alt: "Crypto Greed Index dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@AnkiTyagi007",
    title: "Crypto Greed Index | Real-Time Crypto Sentiment & Market Heatmaps",
    description:
      "Track the crypto fear & greed index, bitcoin dominance, global market cap, and top gainers/losers with live data updated throughout the day.",
    images: ["https://www.cryptogreedindex.com/cryptogreedindex-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "YX6CRwtUTPtaHWQ3WIVAoszHABTSc5kj_FxRGWK55jI",
  },
  other: {
    "google-adsense-account": "ca-pub-1332831285527693",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Crypto Greed Index",
  url: "https://www.cryptogreedindex.com",
  description:
    "Crypto Greed Index provides real-time fear & greed analytics, global market data, and top movers across the cryptocurrency ecosystem.",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "CryptoGreedIndex.com",
    url: "https://www.cryptogreedindex.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.cryptogreedindex.com/cryptogreedindex-logo.png",
    },
  },
  sameAs: [
    "https://www.linkedin.com/feed/",
    "https://x.com/AnkiTyagi007",
    "https://www.instagram.com/crtptogreedindex/",
  ],
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.cryptogreedindex.com/coins?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const dataSetSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "DataSet",
    name: "Crypto Fear and Greed Daily Index",
    description:
      "Daily sentiment scores sourced from Crypto Greed Index.",
    license: "https://www.cryptogreedindex.com/legal/terms",
    temporalCoverage: "P1Y",
    creator: {
      "@type": "Organization",
      name: "CryptoGreedIndex.com",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://www.cryptogreedindex.com/",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "DataSet",
    name: "Crypto Greed Index Market Overview",
    description:
      "Aggregated global market capitalization, 24 hour volume, and bitcoin dominance pulled from the Crypto Greed Index.",
    license: "https://www.cryptogreedindex.com/legal/terms",
    creator: {
      "@type": "Organization",
      name: "CryptoGreedIndex.com",
      url: "https://www.cryptogreedindex.com",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://www.cryptogreedindex.com/coins",
      },
    ],
  },
];

const schemaScripts = [structuredData, ...dataSetSchemas];

const adStyle: CSSProperties = {
  minHeight: "clamp(36px, 18vw, 120px)",
  maxHeight: "140px",
};



const bottomAdProps = {
  adSlot: "1338535383",
  adClient: "ca-pub-1332831285527693",
  adFormat: "auto" as const,
  className: "w-full",
  style: adStyle,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
         
            <main className="flex-1 min-h-screen">
              <div className="mx-auto w-full max-w-6xl px-4 pb-6">{children}</div>
            </main>
            <div className="w-full bg-background/95">
              <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:py-4">
                <AdSenseBannerDeferred {...bottomAdProps} />
              </div>
            </div>
            <Footer />
          </div>
        </Providers>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1332831285527693"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W9J9F0HR2F"
          strategy="afterInteractive"
        />
        <Script id="cfi-google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W9J9F0HR2F');
          `}
        </Script>
        {schemaScripts.map((schema, index) => (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </body>
    </html>
  );
}

