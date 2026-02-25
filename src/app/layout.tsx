import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import AdSenseBannerDeferred from "@/components/AdSenseBannerDeferred";

import "./globals.css";

/* =========================
   METADATA
========================= */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cryptogreedindex.com"),

  title: {
    default:
      "Crypto Fear and Greed Index – Live Market Sentiment & Price Indicators",
    template: "%s | Crypto Fear and Greed Index",
  },

  description:
    "Real-time Crypto Fear and Greed Index. Track live market sentiment, bitcoin dominance, global market capitalization, and top cryptocurrency gainers and losers. Accurate data for Bitcoin, Ethereum, and altcoins.",

  keywords: [
    "fear and greed index",
    "crypto fear and greed index",
    "index fear and greed",
    "bitcoin fear and greed index",
    "crypto market sentiment",
    "live crypto indicators",
    "bitcoin dominance chart",
    "crypto market cap",
    "crypto sentiment analysis",
    "altcoin season indicator",
    "market fear and greed",
    "crypto gainers and losers",
  ],

  applicationName: "Fear and Greed Index",
  authors: [{ name: "CryptoGreedIndex.com" }],
  category: "Finance",

  alternates: {
    canonical: "/",
    languages: {
      en: "https://www.cryptogreedindex.com",
      es: "https://www.cryptogreedindex.com?lang=es",
      pt: "https://www.cryptogreedindex.com?lang=pt",
      ja: "https://www.cryptogreedindex.com?lang=ja",
      ko: "https://www.cryptogreedindex.com?lang=ko",
      hi: "https://www.cryptogreedindex.com?lang=hi",
      de: "https://www.cryptogreedindex.com?lang=de",
      fr: "https://www.cryptogreedindex.com?lang=fr",
      zh: "https://www.cryptogreedindex.com?lang=zh",
      "x-default": "https://www.cryptogreedindex.com",
    },
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
    alternateLocale: [
      "es_ES",
      "pt_BR",
      "ja_JP",
      "ko_KR",
      "hi_IN",
      "de_DE",
      "fr_FR",
      "zh_CN",
    ],
    url: "https://www.cryptogreedindex.com",
    siteName: "Fear and Greed Index",
    title: "Fear and Greed Index – Real-Time Crypto Market Sentiment",
    description:
      "Track the Fear and Greed Index with live crypto sentiment data, bitcoin dominance, global market capitalization, and top crypto movers.",
    images: [
      {
        url: "https://www.cryptogreedindex.com/cryptogreedindex-logo.png",
        width: 1200,
        height: 630,
        alt: "Fear and Greed Index crypto dashboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    creator: "@AnkiTyagi007",
    title: "Fear and Greed Index – Real-Time Crypto Market Sentiment",
    description:
      "Live Fear & Greed Index with crypto market sentiment, bitcoin dominance, and top gainers & losers updated throughout the day.",
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

/* =========================
   VIEWPORT
========================= */

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

/* =========================
   STRUCTURED DATA
========================= */

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CryptoGreedIndex.com",
  url: "https://www.cryptogreedindex.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.cryptogreedindex.com/cryptogreedindex-logo.png",
  },
  sameAs: [
    "https://x.com/AnkiTyagi007",
    "https://www.instagram.com/crtptogreedindex/",
    "https://www.linkedin.com/feed/",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Fear and Greed Index",
  alternateName: [
    "Crypto Fear and Greed Index",
    "Índice de Miedo y Codicia Cripto",
    "Indice de Medo e Ganância Cripto",
    "暗号資産 恐怖と強欲指数",
    "크립토 공포 및 탐욕 지수",
    "क्रिप्टो भय और लालच सूचकांक",
    "Krypto Angst-und-Gier-Index",
    "Indice de peur et cupidité crypto",
    "加密恐惧与贪婪指数",
  ],
  url: "https://www.cryptogreedindex.com",
  description:
    "Fear and Greed Index providing real-time crypto market sentiment indicators, fear & greed scores, bitcoin dominance, and global cryptocurrency data.",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "CryptoGreedIndex.com",
    url: "https://www.cryptogreedindex.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target:
      "https://www.cryptogreedindex.com/coins?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const fearGreedDatasetSchema = {
  "@context": "https://schema.org",
  "@type": "DataSet",
  name: "Crypto Fear and Greed Daily Index",
  url: "https://www.cryptogreedindex.com/",
  description:
    "Daily crypto fear and greed index showing real-time market sentiment indicators derived from cryptocurrency market behavior.",
  keywords: [
    "fear and greed index",
    "crypto fear and greed index",
    "bitcoin fear and greed",
    "crypto market sentiment",
  ],
  temporalCoverage: "P1Y",
  spatialCoverage: "Worldwide",
  creator: {
    "@type": "Organization",
    name: "CryptoGreedIndex.com",
  },
  license: "https://www.cryptogreedindex.com/legal/terms",
  isPartOf: {
    "@type": "WebSite",
    name: "Fear and Greed Index",
    url: "https://www.cryptogreedindex.com",
  },
  distribution: [
    {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://www.cryptogreedindex.com/",
    },
  ],
};

const marketOverviewDatasetSchema = {
  "@context": "https://schema.org",
  "@type": "DataSet",
  name: "Crypto Market Overview and Bitcoin Dominance",
  url: "https://www.cryptogreedindex.com/coins",
  description:
    "Aggregated cryptocurrency market data including global market capitalization, 24-hour trading volume, and bitcoin dominance.",
  keywords: [
    "crypto market cap",
    "bitcoin dominance",
    "crypto market data",
    "crypto market sentiment",
  ],
  spatialCoverage: "Worldwide",
  creator: {
    "@type": "Organization",
    name: "CryptoGreedIndex.com",
  },
  license: "https://www.cryptogreedindex.com/legal/terms",
  isPartOf: {
    "@type": "WebSite",
    name: "Fear and Greed Index",
    url: "https://www.cryptogreedindex.com",
  },
  distribution: [
    {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://www.cryptogreedindex.com/coins",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the Crypto Fear and Greed Index?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Crypto Fear and Greed Index is a tool that measures the emotional sentiment of the cryptocurrency market. It ranges from 0 (Extreme Fear) to 100 (Extreme Greed)."
      }
    },
    {
      "@type": "Question",
      "name": "How is the Fear and Greed Index calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The index is calculated using factors like volatility, market momentum/volume, social media sentiment, bitcoin dominance, and Google Trends data."
      }
    },
    {
      "@type": "Question",
      "name": "Why is Bitcoin dominance important?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bitcoin dominance tracks BTC's share of the total crypto market cap. High dominance often signals a 'risk-off' environment, while falling dominance can indicate an 'altcoin season'."
      }
    }
  ]
};

const financialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Crypto Fear and Greed Index",
  "description": "Real-time cryptocurrency market analysis and sentiment tracking service.",
  "url": "https://www.cryptogreedindex.com",
  "category": "Cryptocurrency Analysis",
  "feesAndCommissionsSpecification": "Free to use"
};

const schemaScripts = [
  organizationSchema,
  websiteSchema,
  fearGreedDatasetSchema,
  marketOverviewDatasetSchema,
  faqSchema,
  financialServiceSchema,
];

/* =========================
   ADS CONFIG
========================= */

const adStyle: CSSProperties = {
  minHeight: "clamp(36px, 18vw, 120px)",
  maxHeight: "140px",
};

const topAdStyle: CSSProperties = {
  minHeight: "clamp(32px, 12vw, 80px)",
  maxHeight: "90px",
};

const topAdProps = {
  adSlot: "9708814146",
  adClient: "ca-pub-1332831285527693",
  adFormat: "auto" as const,
  className: "w-full",
  style: topAdStyle,
};

const bottomAdProps = {
  adSlot: "1338535383",
  adClient: "ca-pub-1332831285527693",
  adFormat: "auto" as const,
  className: "w-full",
  style: adStyle,
};

/* =========================
   ROOT LAYOUT
========================= */

export default function RootLayout({
  children,
  searchParams,
}: {
  children: ReactNode;
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang ?? "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="bg-background font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />

            <div className="w-full bg-background/95">
              <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:py-4">
                <AdSenseBannerDeferred {...topAdProps} />
              </div>
            </div>

            <main className="flex-1 min-h-screen">
              <div className="mx-auto w-full max-w-6xl px-4 pb-6">
                {children}
              </div>
            </main>

            <div className="w-full bg-background/95">
              <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:py-4">
                <AdSenseBannerDeferred {...bottomAdProps} />
              </div>
            </div>

            <Footer />
          </div>
        </Providers>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1332831285527693"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W9J9F0HR2F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W9J9F0HR2F');
          `}
        </Script>

        {/* Structured Data */}
        {schemaScripts.map((schema, index) => (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        ))}
      </body>
    </html>
  );
}
