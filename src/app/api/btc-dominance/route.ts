import { NextResponse } from "next/server";

import {
  buildBtcDominanceFallbackData,
  extractBtcDominancePoints,
  fetchCoinStats,
} from "@/lib/coinstats";

type BtcDominanceApiResponse = {
  points: Array<{ timestamp: number; dominance: number }>;
  source: "coinstats" | "fallback";
  meta?: {
    error?: string;
    fetchedAt?: string;
    period?: string;
  };
};

const ALLOWED_PERIODS = new Set([
  "24h",
  "1w",
  "1m",
  "3m",
  "6m",
  "1y",
  "all",
]);

export const revalidate = 86_400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedPeriod = searchParams.get("period") ?? "1y";
  const period = ALLOWED_PERIODS.has(requestedPeriod)
    ? requestedPeriod
    : "1y";

  try {
    const raw = await fetchCoinStats<unknown>("/insights/btc-dominance", {
      searchParams: { type: period },
    });

    const points = extractBtcDominancePoints(raw);

    if (!points.length) {
      throw new Error("Empty dominance response");
    }

    return NextResponse.json<BtcDominanceApiResponse>(
      {
        points,
        source: "coinstats",
        meta: {
          fetchedAt: new Date().toISOString(),
          period,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=86400, stale-while-revalidate=43200",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch BTC dominance data", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const fallback = buildBtcDominanceFallbackData(period);

    return NextResponse.json<BtcDominanceApiResponse>({
      points: fallback,
      source: "fallback",
      meta: {
        error: message,
        fetchedAt: new Date().toISOString(),
        period,
      },
    });
  }
}

