import { NextResponse } from "next/server";

import { fetchCoinStatsMarket } from "@/lib/coinstats-market";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = (searchParams.get("currency") ?? "USD").toUpperCase();

  try {
    const data = await fetchCoinStatsMarket<Record<string, unknown>>("/markets", {
      searchParams: {
        currency,
      },
    });

    const result =
      (typeof data.result === "object" && data.result !== null
        ? (data.result as Record<string, unknown>)
        : undefined) ?? data;

    const overview = extractMarketOverview(result);

    return NextResponse.json(
      {
        currency,
        ...overview,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch CoinStats market overview", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Unable to retrieve market overview", details: message },
      { status: 502 },
    );
  }
}

function extractMarketOverview(raw: Record<string, unknown>) {
  const toNumber = (value: unknown): number | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  };

  const marketCap =
    toNumber(raw.marketCap) ??
    toNumber(raw.totalMarketCap) ??
    toNumber(raw.marketcap) ??
    toNumber(raw.totalMarketCap) ??
    toNumber(raw.marketCapUsd) ??
    toNumber(raw.globalMarketCap);

  const marketCapChange24h =
    toNumber(raw.marketCapChange24h) ??
    toNumber(raw.marketCapPercentChange24h) ??
    toNumber(raw.marketCap24hChange) ??
    toNumber(raw.marketCapChangePct24h) ??
    toNumber(raw.marketCapChange) ??
    toNumber(raw.marketcapChange) ??
    toNumber(raw.marketCapChangePercent);

  const volume24h =
    toNumber(raw.volume24h) ??
    toNumber(raw.total24hVolume) ??
    toNumber(raw.volume) ??
    toNumber(raw.volumeUsd);

  const volumeChange24h =
    toNumber(raw.volumeChange24h) ??
    toNumber(raw.volume24hChange) ??
    toNumber(raw.volumeChangePct24h) ??
    toNumber(raw.volumePercentChange24h) ??
    toNumber(raw.volumeChange) ??
    toNumber(raw.volumeChangePercent);

  const bitcoinDominance =
    toNumber(raw.bitcoinDominance) ??
    toNumber(raw.btcDominance) ??
    toNumber(raw.bitcoinDominancePercentage) ??
    toNumber(raw.bitcoinDominancePercent);

  const bitcoinDominanceChange24h =
    toNumber(raw.bitcoinDominanceChange24h) ??
    toNumber(raw.btcDominanceChange24h) ??
    toNumber((raw as Record<string, unknown>).btcDominanceChange24H) ??
    toNumber((raw as Record<string, unknown>).bitcoinDominanceChange24H) ??
    toNumber(raw.bitcoinDominanceChangePct24h) ??
    toNumber(raw.bitcoinDominanceChangePercent) ??
    toNumber(raw.bitcoinDominanceChange) ??
    toNumber(raw.btcDominanceChange) ??
    toNumber((raw as Record<string, unknown>).btcDominanceChangePercent);

  const updatedAt =
    toNumber(raw.updatedAt) ??
    toNumber(raw.updated_at) ??
    toNumber(raw.lastUpdated) ??
    toNumber(raw.timestamp) ??
    toNumber(raw.time);

  return {
    marketCap,
    marketCapChange24h,
    volume24h,
    volumeChange24h,
    bitcoinDominance,
    bitcoinDominanceChange24h,
    updatedAt,
    source: raw.source,
  };
}


