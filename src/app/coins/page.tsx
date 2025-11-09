import type { Metadata } from "next";

import CoinsPageContent from "@/components/CoinsPageContent";
import { fetchCoinStatsMarket } from "@/lib/coinstats-market";

type CoinRecord = Record<string, unknown>;

const PAGE_URL = "https://www.cryptogreedindex.com/coins";
const COIN_LIST_LIMIT = 10;

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Top Cryptocurrencies by Market Cap Today",
  description:
    "Compare live cryptocurrency prices, market capitalisation, 24h performance, and dominance metrics for the leading digital assets.",
  keywords: [
    "crypto prices",
    "cryptocurrency market cap",
    "top cryptocurrencies",
    "bitcoin price",
    "ethereum price",
    "crypto market overview",
  ],
  alternates: {
    canonical: "/coins",
    languages: {
      en: "https://www.cryptogreedindex.com/coins",
      es: "https://www.cryptogreedindex.com/es/coins",
      de: "https://www.cryptogreedindex.com/de/coins",
      pt: "https://www.cryptogreedindex.com/pt/coins",
      ja: "https://www.cryptogreedindex.com/ja/coins",
      ko: "https://www.cryptogreedindex.com/ko/coins",
      hi: "https://www.cryptogreedindex.com/hi/coins",
      fr: "https://www.cryptogreedindex.com/fr/coins",
      zh: "https://www.cryptogreedindex.com/zh/coins",
    },
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Live Crypto Prices & Market Capitalisation",
    description:
      "Stay on top of the cryptocurrency market with real-time prices, market cap rankings, and daily performance insights.",
    images: [
      {
        url: "https://www.cryptogreedindex.com/cryptogreedindex-logo.png",
        width: 1200,
        height: 630,
        alt: "Crypto Greed Index cryptocurrency market overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Crypto Prices & Market Capitalisation",
    description:
      "Track top cryptocurrencies by market cap with prices, percentage changes, and sparklines refreshed throughout the day.",
    images: ["https://www.cryptogreedindex.com/cryptogreedindex-logo.png"],
  },
};

function extractCoinsArray(payload: CoinRecord) {
  const candidates: unknown[] = [];

  if (Array.isArray(payload.result)) {
    candidates.push(payload.result);
  } else if (
    payload.result &&
    typeof payload.result === "object" &&
    Array.isArray((payload.result as CoinRecord).coins)
  ) {
    candidates.push((payload.result as CoinRecord).coins as unknown[]);
  }

  if (Array.isArray(payload.coins)) {
    candidates.push(payload.coins as unknown[]);
  }

  if (!candidates.length) {
    return [] as CoinRecord[];
  }

  const found = candidates.find((entry) => Array.isArray(entry)) as
    | CoinRecord[]
    | undefined;

  return found ?? [];
}

async function getCoinsItemList() {
  try {
    const response = await fetchCoinStatsMarket<CoinRecord>("/coins", {
      searchParams: {
        limit: COIN_LIST_LIMIT,
        currency: "USD",
        sortBy: "marketCap",
        sortDir: "desc",
        priceChange1d: true,
      },
    });

    const coins = extractCoinsArray(response).slice(0, COIN_LIST_LIMIT);

    return coins
      .map((coin, index) => {
        const id = typeof coin.id === "string" ? coin.id : undefined;
        const name = typeof coin.name === "string" ? coin.name : undefined;
        const symbol =
          typeof coin.symbol === "string" ? coin.symbol.toUpperCase() : undefined;
        const price =
          typeof coin.price === "number" && Number.isFinite(coin.price)
            ? coin.price
            : undefined;
        const marketCap =
          typeof coin.marketCap === "number" && Number.isFinite(coin.marketCap)
            ? coin.marketCap
            : undefined;
        const image = typeof coin.icon === "string" ? coin.icon : undefined;

        if (!id || !name) {
          return null;
        }

        const itemBase = {
          "@type": "ListItem",
          position: index + 1,
          name,
          url: `https://www.cryptogreedindex.com/coins/${id}`,
        } as Record<string, unknown>;

        if (symbol) {
          itemBase.tickerSymbol = symbol;
        }

        if (image) {
          itemBase.image = image;
        }

        const offers: Record<string, unknown> = {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        };

        if (price !== undefined) {
          offers.price = price;
        }

        if (marketCap !== undefined) {
          const ratingValue = Math.min(
            5,
            Math.max(1, Math.round(Math.log10(marketCap + 1))),
          );

          itemBase.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue,
            ratingCount: Math.max(1, Math.round(marketCap / 1_000_000)),
          };
        }

        if (price !== undefined) {
          itemBase.offers = offers;
        }

        return itemBase;
      })
      .filter(Boolean) as Record<string, unknown>[];
  } catch (error) {
    console.error("Failed to build coins structured data", error);
    return [] as Record<string, unknown>[];
  }
}

async function getStructuredDataSchemas() {
  const itemListElement = await getCoinsItemList();

  const schemas: Record<string, unknown>[] = [
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
          name: "Cryptocurrencies",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Top Cryptocurrencies by Market Cap",
      url: PAGE_URL,
      description:
        "Explore real-time cryptocurrency prices, market caps, and daily performance for the leading digital assets.",
      inLanguage: "en",
    },
  ];

  if (itemListElement.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Top 10 Cryptocurrencies by Market Capitalisation",
      description:
        "Live leaderboard of the largest cryptocurrencies including price and ranking information.",
      numberOfItems: itemListElement.length,
      itemListOrder: "Descending",
      url: PAGE_URL,
      itemListElement,
    });
  }

  return schemas;
}

export default async function CoinsPage() {
  const schemas = await getStructuredDataSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`coins-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CoinsPageContent />
    </>
  );
}

