import type { Metadata } from "next";

import BtcDominancePageContent from "@/components/BtcDominancePageContent";
import { extractBtcDominancePoints, fetchCoinStats } from "@/lib/coinstats";

const PAGE_URL = "https://www.cryptogreedindex.com/btc-dominance";
const DEFAULT_PERIOD = "1y";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Bitcoin Dominance Chart & Market Share Insights",
  description:
    "Analyse Bitcoin's market dominance across multiple time frames with live data, context, and guidance on interpreting shifts in crypto market share.",
  keywords: [
    "bitcoin dominance",
    "btc market share",
    "crypto dominance chart",
    "bitcoin vs altcoins",
    "crypto market analytics",
  ],
  alternates: {
    canonical: "/btc-dominance",
    languages: {
      en: "https://www.cryptogreedindex.com/btc-dominance",
      es: "https://www.cryptogreedindex.com/es/btc-dominance",
      de: "https://www.cryptogreedindex.com/de/btc-dominance",
      pt: "https://www.cryptogreedindex.com/pt/btc-dominance",
      ja: "https://www.cryptogreedindex.com/ja/btc-dominance",
      ko: "https://www.cryptogreedindex.com/ko/btc-dominance",
      hi: "https://www.cryptogreedindex.com/hi/btc-dominance",
      fr: "https://www.cryptogreedindex.com/fr/btc-dominance",
      zh: "https://www.cryptogreedindex.com/zh/btc-dominance",
    },
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Bitcoin Dominance Chart & Market Share Insights",
    description:
      "Track Bitcoin's percentage share of the total cryptocurrency market with historical context and expert analysis.",
    images: [
      {
        url: "https://www.cryptogreedindex.com/cryptogreedindex-logo.png",
        width: 1200,
        height: 630,
        alt: "Crypto Greed Index Bitcoin dominance dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Dominance Chart & Market Share Insights",
    description:
      "Monitor Bitcoin dominance trends with multi-timeframe charts, narrative guidance, and daily market share updates.",
    images: ["https://www.cryptogreedindex.com/cryptogreedindex-logo.png"],
  },
};

type DominanceSchema = Record<string, unknown>;

function formatIso(timestamp: number) {
  return new Date(timestamp * 1000).toISOString();
}

async function getDominanceSchemas(): Promise<DominanceSchema[]> {
  const baseSchemas: DominanceSchema[] = [
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
          name: "Bitcoin Dominance",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Bitcoin Dominance Chart & Market Share Insights",
      url: PAGE_URL,
      inLanguage: "en",
      description:
        "Live Bitcoin dominance dashboard with historical charts, narrative explanations, and strategies for interpreting market share shifts.",
    },
  ];

  try {
    const raw = await fetchCoinStats<unknown>("/insights/btc-dominance", {
      searchParams: { type: DEFAULT_PERIOD },
    });

    const points = extractBtcDominancePoints(raw);

    if (!points.length) {
      return baseSchemas;
    }

    const firstPoint = points[0];
    const latestPoint = points[points.length - 1];
    const previousPoint = points.length > 1 ? points[points.length - 2] : undefined;
    const change =
      latestPoint && previousPoint
        ? latestPoint.dominance - previousPoint.dominance
        : undefined;
    const changePercent =
      change !== undefined && previousPoint && previousPoint.dominance !== 0
        ? (change / previousPoint.dominance) * 100
        : undefined;

    const variableMeasured: DominanceSchema[] = [
      {
        "@type": "PropertyValue",
        name: "Bitcoin market dominance",
        description: "Share of total cryptocurrency market capitalisation held by Bitcoin.",
        unitText: "Percent",
      },
    ];

    if (latestPoint) {
      variableMeasured.push({
        "@type": "PropertyValue",
        name: "Latest dominance reading",
        unitText: "Percent",
        value: Number(latestPoint.dominance.toFixed(2)),
        observationDate: formatIso(latestPoint.timestamp),
      });
    }

    if (change !== undefined && changePercent !== undefined && latestPoint) {
      variableMeasured.push({
        "@type": "PropertyValue",
        name: "Daily dominance change",
        unitText: "Percent",
        value: Number(change.toFixed(2)),
        valueReference: {
          "@type": "QuantitativeValue",
          unitText: "Percent",
          value: Number(changePercent.toFixed(2)),
          description: "Relative percent change versus the previous observation.",
        },
        observationDate: formatIso(latestPoint.timestamp),
      });
    }

    const dataset: DominanceSchema = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Bitcoin Dominance Historical Dataset",
      description:
        "Historical Bitcoin dominance percentages aggregated from CoinStats and visualised by Crypto Greed Index.",
      url: PAGE_URL,
      keywords: ["bitcoin dominance", "crypto market share", "btc vs altcoins"],
      license: "https://www.cryptogreedindex.com/legal/terms",
      creator: {
        "@type": "Organization",
        name: "CryptoGreedIndex.com",
        url: "https://www.cryptogreedindex.com",
      },
      numberOfDataPoints: points.length,
      measurementTechnique: "Market capitalisation weighting",
      variableMeasured,
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: "https://www.cryptogreedindex.com/api/btc-dominance?period=1y",
        },
      ],
    };

    if (firstPoint && latestPoint) {
      const startIso = formatIso(firstPoint.timestamp);
      const endIso = formatIso(latestPoint.timestamp);
      dataset.temporalCoverage = `${startIso}/${endIso}`;
    }

    baseSchemas.push(dataset);

    return baseSchemas;
  } catch (error) {
    console.error("Failed to build BTC dominance structured data", error);
    return baseSchemas;
  }
}

export default async function BtcDominancePage() {
  const schemas = await getDominanceSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`btc-dominance-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <BtcDominancePageContent />
    </>
  );
}

