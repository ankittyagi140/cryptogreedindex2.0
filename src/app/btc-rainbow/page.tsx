import type { Metadata } from "next";

import BtcRainbowPageContent from "@/components/BtcRainbowPageContent";
import { extractRainbowPoints, fetchCoinStats } from "@/lib/coinstats";

const PAGE_URL = "https://www.cryptogreedindex.com/btc-rainbow";
const DEFAULT_COIN_ID = "bitcoin";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Bitcoin Rainbow Chart & Historical Valuation Bands",
  description:
    "Visualise Bitcoin's long-term price performance with the Rainbow Chart, compare valuation zones, and track sentiment-driven market cycles.",
  keywords: [
    "bitcoin rainbow chart",
    "btc rainbow",
    "bitcoin valuation bands",
    "bitcoin price history",
    "crypto sentiment bands",
  ],
  alternates: {
    canonical: "/btc-rainbow",
    languages: {
      en: "https://www.cryptogreedindex.com/btc-rainbow",
      es: "https://www.cryptogreedindex.com/es/btc-rainbow",
      de: "https://www.cryptogreedindex.com/de/btc-rainbow",
      pt: "https://www.cryptogreedindex.com/pt/btc-rainbow",
      ja: "https://www.cryptogreedindex.com/ja/btc-rainbow",
      ko: "https://www.cryptogreedindex.com/ko/btc-rainbow",
      hi: "https://www.cryptogreedindex.com/hi/btc-rainbow",
      fr: "https://www.cryptogreedindex.com/fr/btc-rainbow",
      zh: "https://www.cryptogreedindex.com/zh/btc-rainbow",
    },
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Bitcoin Rainbow Chart & Historical Valuation Bands",
    description:
      "Track Bitcoin's historical price trajectory with colour-coded valuation zones and insights into long-term market cycles.",
    images: [
      {
        url: "https://www.cryptogreedindex.com/cryptogreedindex-logo.png",
        width: 1200,
        height: 630,
        alt: "Crypto Greed Index Bitcoin rainbow chart overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Rainbow Chart & Historical Valuation Bands",
    description:
      "Analyse Bitcoin's price history through the Rainbow Chart to understand long-term valuation zones and market sentiment.",
    images: ["https://www.cryptogreedindex.com/cryptogreedindex-logo.png"],
  },
};

type RainbowSchema = Record<string, unknown>;

function toIsoString(dateLike: string | number) {
  const date = typeof dateLike === "number" ? new Date(dateLike * 1000) : new Date(dateLike);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

async function getRainbowSchemas(): Promise<RainbowSchema[]> {
  const baseSchemas: RainbowSchema[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.cryptogreedindex.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bitcoin Rainbow Chart",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Bitcoin Rainbow Chart & Historical Valuation Bands",
      url: PAGE_URL,
      description:
        "Interactive Bitcoin Rainbow Chart with historical pricing, valuation zones, and sentiment-based analysis.",
      inLanguage: "en",
    },
  ];

  try {
    const raw = await fetchCoinStats<unknown>(`/insights/rainbow-chart/${DEFAULT_COIN_ID}`);
    const points = extractRainbowPoints(raw);

    if (!points.length) {
      return baseSchemas;
    }

    const firstPoint = points[0];
    const latestPoint = points[points.length - 1];

    const variableMeasured: Array<Record<string, unknown>> = [
      {
        "@type": "PropertyValue",
        name: "Bitcoin price",
        description: "Historical closing price for Bitcoin expressed in USD.",
        unitText: "USD",
      },
    ];

    const dataset: RainbowSchema = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Bitcoin Rainbow Chart Historical Dataset",
      description:
        "Historical Bitcoin pricing captured within the Rainbow Chart valuation framework, curated by Crypto Greed Index using CoinStats data.",
      url: PAGE_URL,
      keywords: ["bitcoin", "rainbow chart", "crypto valuation", "btc price history"],
      creator: {
        "@type": "Organization",
        name: "CryptoGreedIndex.com",
        url: "https://www.cryptogreedindex.com",
      },
      license: "https://www.cryptogreedindex.com/legal/terms",
      numberOfDataPoints: points.length,
      measurementTechnique: "Logarithmic regression valuation bands",
      variableMeasured,
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: "https://www.cryptogreedindex.com/api/btc-rainbow?coinId=bitcoin",
        },
      ],
    };

    const startIso = toIsoString(firstPoint.date);
    const endIso = toIsoString(latestPoint.date);

    if (startIso && endIso) {
      dataset.temporalCoverage = `${startIso}/${endIso}`;
    }

    if (latestPoint) {
      const latestIso = toIsoString(latestPoint.date);
      if (latestIso) {
        variableMeasured.push({
          "@type": "PropertyValue",
          name: "Latest Bitcoin price",
          unitText: "USD",
          value: Number(latestPoint.price.toFixed(2)),
          observationDate: latestIso,
        });
      }
    }

    baseSchemas.push(dataset);

    return baseSchemas;
  } catch (error) {
    console.error("Failed to build Bitcoin rainbow structured data", error);
    return baseSchemas;
  }
}

export default async function BtcRainbowPage() {
  const schemas = await getRainbowSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`btc-rainbow-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <BtcRainbowPageContent />
    </>
  );
}

