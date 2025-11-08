import { NextResponse } from "next/server";

import {
  buildFearGreedFallbackData,
  fetchCoinStats,
  type CoinStatsFearGreedResponse,
} from "@/lib/coinstats";

type FearGreedApiResponse = CoinStatsFearGreedResponse & {
  source: "coinstats" | "fallback";
  meta?: {
    error?: string;
  };
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchCoinStats<CoinStatsFearGreedResponse>(
      "/insights/fear-and-greed",
    );

    return NextResponse.json<FearGreedApiResponse>(
      { ...data, source: "coinstats" },
      {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=300",
      },
      },
    );
  } catch (error) {
    console.error("Failed to fetch CoinStats fear and greed data", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    const fallback = buildFearGreedFallbackData();

    return NextResponse.json<FearGreedApiResponse>({
      ...fallback,
      source: "fallback",
      meta: {
        error: message,
      },
    });
  }
}

