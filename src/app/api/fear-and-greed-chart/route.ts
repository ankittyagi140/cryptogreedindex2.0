import { NextResponse } from "next/server";

import {
  buildFearGreedChartFallbackData,
  buildPriceChartFallbackData,
  extractFearGreedChartPoints,
  extractPriceChartPoints,
  fetchCoinStats,
  mergeFearGreedWithPrice,
  type CoinStatsFearGreedChartPoint,
} from "@/lib/coinstats";

type FearGreedChartApiResponse = {
  points: CoinStatsFearGreedChartPoint[];
  source: "coinstats" | "fallback";
  meta?: {
    error?: string;
    priceFallback?: string;
  };
};

export const revalidate = 86_400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "1y";
  const pricePeriod = normalizeCoinChartPeriod(period);

  try {
    const fearGreedRaw = await fetchCoinStats<unknown>(
      "/insights/fear-and-greed/chart",
      {
        searchParams: { period },
      },
    );

    const points = extractFearGreedChartPoints(fearGreedRaw);

    let pricePoints;
    let priceError: string | undefined;
    try {
      const priceRaw = await fetchCoinStats<unknown>("/coins/bitcoin/charts", {
        searchParams: { period: pricePeriod, currency: "USD" },
      });
      pricePoints = extractPriceChartPoints(priceRaw);
    } catch (priceErr) {
      priceError =
        priceErr instanceof Error ? priceErr.message : "Unknown error";
      pricePoints = buildPriceChartFallbackData();
    }

    const merged = mergeFearGreedWithPrice(points, pricePoints);

    return NextResponse.json<FearGreedChartApiResponse>(
      {
        points: merged,
        source: "coinstats",
        meta: priceError
          ? {
              priceFallback: priceError,
            }
          : undefined,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=86400, stale-while-revalidate=43200",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch CoinStats fear and greed chart data", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    const fallbackPoints = buildFearGreedChartFallbackData();

    return NextResponse.json<FearGreedChartApiResponse>({
      points: fallbackPoints,
      source: "fallback",
      meta: {
        error: message,
      },
    });
  }
}

function normalizeCoinChartPeriod(input: string): string {
  const value = input.toLowerCase();

  const allowed = new Set(["24h", "1w", "1m", "3m", "6m", "1y", "all"]);
  if (allowed.has(value)) {
    return value;
  }

  const map: Record<string, string> = {
    "7d": "1w",
    "30d": "1m",
    "60d": "3m",
    "90d": "3m",
    "180d": "6m",
    "365d": "1y",
    "12m": "1y",
  };

  return map[value] ?? "1m";
}

