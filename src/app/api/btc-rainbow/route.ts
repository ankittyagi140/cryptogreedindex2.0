import { NextResponse } from "next/server";

import {
  extractRainbowPoints,
  fetchCoinStats,
  buildRainbowFallbackData,
} from "@/lib/coinstats";

type RainbowPoint = { date: string; price: number };

type RainbowApiResponse = {
  points: RainbowPoint[];
  source: "coinstats" | "fallback";
  meta?: { coinId: string; fetchedAt: string; error?: string };
};

const ALLOWED_COINS = new Set(["bitcoin", "ethereum"]);

export const revalidate = 86_400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId") ?? "bitcoin";
  const normalizedCoin = ALLOWED_COINS.has(coinId) ? coinId : "bitcoin";

  try {
    const raw = await fetchCoinStats<unknown>(
      `/insights/rainbow-chart/${normalizedCoin}`,
    );

    const points = extractRainbowPoints(raw);

    if (!points.length) {
      throw new Error("Empty rainbow response");
    }

    return NextResponse.json<RainbowApiResponse>(
      {
        points,
        source: "coinstats",
        meta: { coinId: normalizedCoin, fetchedAt: new Date().toISOString() },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=86400, stale-while-revalidate=43200",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch rainbow data", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const fallback = buildRainbowFallbackData(normalizedCoin);

    return NextResponse.json<RainbowApiResponse>({
      points: fallback,
      source: "fallback",
      meta: {
        coinId: normalizedCoin,
        fetchedAt: new Date().toISOString(),
        error: message,
      },
    });
  }
}

