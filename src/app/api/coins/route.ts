import { NextResponse } from "next/server";

import { fetchCoinStatsMarket } from "@/lib/coinstats-market";
import { extractPriceChartPoints } from "@/lib/coinstats";

type LimitParam = string | null;

export const dynamic = "force-dynamic";

const MAX_SPARKLINE_POINTS = 60;
const SPARKLINE_PERIOD = "1w";
const SPARKLINE_INTERVAL = "1h";
const SPARKLINE_BATCH_SIZE = 20;
const MAX_ADDITIONAL_PAGE_FETCHES = 5;

type CoinsMetaPayload = {
  page?: number;
  limit?: number;
  itemCount?: number;
  pageCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
};

function toNumber(value: LimitParam, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = toNumber(searchParams.get("limit"), 10);
  const page = toNumber(searchParams.get("page"), 1);
  const rawCurrency = searchParams.get("currency") ?? "USD";
  const currency = rawCurrency.toUpperCase();
  const sortBy = searchParams.get("sortBy") ?? "marketCap";
  const sortDir = searchParams.get("sortDir") ?? "desc";

  try {
    const baseSearchParams = {
      limit,
      currency,
      sortBy,
      sortDir,
      priceChange1d: true,
      priceChange1w: true,
      priceChange1h: true,
    } as const;

    const initialData =
      await fetchCoinStatsMarket<Record<string, unknown>>("/coins", {
        searchParams: {
          ...baseSearchParams,
          page,
        },
      });

    const initialCoins = extractCoinsArray(initialData);
    const aggregatedCoins = dedupeCoins(initialCoins);

    const initialMeta = extractCoinsMeta(initialData);
    let latestMeta = initialMeta;
    let fetchedPages = 0;
    let currentPage = page;

    while (
      aggregatedCoins.length < limit &&
      fetchedPages < MAX_ADDITIONAL_PAGE_FETCHES &&
      shouldAttemptAdditionalFetch(latestMeta, aggregatedCoins.length, limit)
    ) {
      currentPage += 1;
      fetchedPages += 1;

      const nextData =
        await fetchCoinStatsMarket<Record<string, unknown>>("/coins", {
          searchParams: {
            ...baseSearchParams,
            page: currentPage,
          },
        });

      const nextCoins = extractCoinsArray(nextData);
      if (!nextCoins.length) {
        latestMeta = extractCoinsMeta(nextData) ?? latestMeta;
        break;
      }

      const beforeAppendLength = aggregatedCoins.length;
      appendUniqueCoins(aggregatedCoins, nextCoins);
      const afterAppendLength = aggregatedCoins.length;

      latestMeta = extractCoinsMeta(nextData) ?? latestMeta;

      if (afterAppendLength === beforeAppendLength) {
        break;
      }
    }

    const limitedCoins = aggregatedCoins.slice(0, limit);
    const sparklineMap = await fetchSparklinesForCoins(
      limitedCoins,
      currency.toLowerCase(),
    );

    const coinsWithSparkline: Record<string, unknown>[] = limitedCoins.map(
      (coinRecord) => {
        const rawId = coinRecord["id"];
        const id = typeof rawId === "string" ? rawId : undefined;

        return {
          ...coinRecord,
          sparkline: id ? sparklineMap.get(id) ?? [] : [],
        };
      },
    );

    const hasAdditionalCoins = aggregatedCoins.length > limit;
    const metaSource = latestMeta ?? initialMeta;
    const metaOverride = metaSource
      ? {
          ...metaSource,
          page,
          limit,
          hasPreviousPage: metaSource.hasPreviousPage ?? page > 1,
          hasNextPage:
            metaSource.hasNextPage ?? (hasAdditionalCoins ? true : false),
        }
      : {
          page,
          limit,
          hasPreviousPage: page > 1,
          hasNextPage: hasAdditionalCoins,
        };

    const responsePayload: Record<string, unknown> = {
      ...initialData,
      meta: metaOverride,
    };

    if (Array.isArray(responsePayload.result)) {
      responsePayload.result = coinsWithSparkline;
    } else if (
      responsePayload.result &&
      typeof responsePayload.result === "object"
    ) {
      responsePayload.result = {
        ...(responsePayload.result as Record<string, unknown>),
        coins: coinsWithSparkline,
      };
    } else {
      responsePayload.result = coinsWithSparkline;
    }

    responsePayload.coins = coinsWithSparkline;

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=150",
      },
    });
  } catch (error) {
    console.error("Failed to fetch CoinStats coin data", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Unable to retrieve coin data", details: message },
      { status: 502 },
    );
  }
}

async function fetchSparklinesForCoins(
  coins: Record<string, unknown>[],
  currency: string,
) {
  const sparklineMap = new Map<string, number[]>();
  const ids = coins
    .map((coin) => {
      const rawId = coin["id"];
      return typeof rawId === "string" ? rawId : undefined;
    })
    .filter((id): id is string => Boolean(id));

  if (!ids.length) {
    return sparklineMap;
  }

  const batches: string[][] = [];
  for (let index = 0; index < ids.length; index += SPARKLINE_BATCH_SIZE) {
    batches.push(ids.slice(index, index + SPARKLINE_BATCH_SIZE));
  }

  const expectedIds = new Set(ids);

  for (const batch of batches) {
    try {
      const chartsResponse = await fetchCoinStatsMarket<Record<string, unknown>>(
        "/coins/charts",
        {
          searchParams: {
            coinIds: batch.join(","),
            period: SPARKLINE_PERIOD,
            interval: SPARKLINE_INTERVAL,
            currency,
          },
        },
      );

      populateSparklineBatch(sparklineMap, chartsResponse, expectedIds);
    } catch (batchError) {
      console.error(
        `Failed to fetch sparkline batch for ids [${batch.join(", ")}]`,
        batchError,
      );
    }
  }

  return sparklineMap;
}

function populateSparklineBatch(
  target: Map<string, number[]>,
  raw: unknown,
  expectedIds: Set<string>,
) {
  if (!raw) return;

  const processItem = (item: unknown, fallbackId?: string) => {
    if (!item || typeof item !== "object") {
      return;
    }

    const record = item as Record<string, unknown>;
    const idCandidate =
      typeof record.id === "string"
        ? record.id
        : typeof record.coinId === "string"
        ? record.coinId
        : typeof record.coin === "string"
        ? record.coin
        : fallbackId;

    if (!idCandidate || !expectedIds.has(idCandidate)) {
      return;
    }

    let extractedPoints = extractPriceChartPoints(
      record.chart ?? record.charts ?? record,
    );

    if (!extractedPoints.length) {
      const nestedKeys = ["data", "points", "prices", "values", "series"];
      for (const key of nestedKeys) {
        const candidate = record[key];
        if (!candidate) continue;
        const nestedPoints = extractPriceChartPoints(candidate);
        if (nestedPoints.length) {
          extractedPoints = nestedPoints;
          break;
        }
      }
    }

    if (!extractedPoints.length) {
      return;
    }

    target.set(idCandidate, normalizeSparkline(extractedPoints));
  };

  if (Array.isArray(raw)) {
    raw.forEach((item) => processItem(item));
    return;
  }

  if (typeof raw !== "object") {
    return;
  }

  const container = raw as Record<string, unknown>;

  const result = container.result;
  if (Array.isArray(result)) {
    result.forEach((item) => processItem(item));
  } else if (result && typeof result === "object") {
    Object.entries(result as Record<string, unknown>).forEach(
      ([key, value]) => {
        if (expectedIds.has(key)) {
          processItem(value, key);
        } else {
          processItem(value);
        }
      },
    );
  }

  const collections = ["data", "charts", "points", "prices"];
  collections.forEach((key) => {
    const value = container[key];
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => processItem(item));
    } else if (typeof value === "object") {
      Object.entries(value as Record<string, unknown>).forEach(
        ([entryKey, entryValue]) => {
          if (expectedIds.has(entryKey)) {
            processItem(entryValue, entryKey);
          } else {
            processItem(entryValue);
          }
        },
      );
    }
  });

  Object.entries(container).forEach(([key, value]) => {
    if (expectedIds.has(key)) {
      processItem(value, key);
    }
  });
}

function normalizeSparkline(points: ReturnType<typeof extractPriceChartPoints>) {
  if (!points.length) {
    return [];
  }

  const prices = points.map((point) => point.price);

  if (prices.length <= MAX_SPARKLINE_POINTS) {
    return prices;
  }

  const step = (prices.length - 1) / (MAX_SPARKLINE_POINTS - 1);
  const sampled: number[] = [];

  for (let index = 0; index < MAX_SPARKLINE_POINTS; index++) {
    const rawIdx =
      index === MAX_SPARKLINE_POINTS - 1
        ? prices.length - 1
        : Math.round(index * step);
    const value = prices[rawIdx];
    if (value !== undefined) {
      sampled.push(value);
    }
  }

  if (sampled.length && sampled[sampled.length - 1] !== prices[prices.length - 1]) {
    sampled[sampled.length - 1] = prices[prices.length - 1];
  }

  return sampled;
}

function extractCoinsArray(payload: Record<string, unknown>) {
  const candidates: unknown[] = [];

  if (Array.isArray(payload.result)) {
    candidates.push(payload.result);
  } else if (
    payload.result &&
    typeof payload.result === "object" &&
    Array.isArray((payload.result as Record<string, unknown>).coins)
  ) {
    candidates.push(
      (payload.result as Record<string, unknown>).coins as unknown[],
    );
  }

  if (Array.isArray(payload.coins)) {
    candidates.push(payload.coins as unknown[]);
  }

  if (!candidates.length) {
    return [];
  }

  return (candidates.find((array) => Array.isArray(array)) as Record<
    string,
    unknown
  >[] | undefined) ?? [];
}

function extractCoinsMeta(payload: Record<string, unknown>) {
  const rawMeta = payload.meta;
  if (rawMeta && typeof rawMeta === "object") {
    return rawMeta as CoinsMetaPayload;
  }

  if (payload.result && typeof payload.result === "object") {
    const nested = payload.result as Record<string, unknown>;
    if (nested.meta && typeof nested.meta === "object") {
      return nested.meta as CoinsMetaPayload;
    }
  }

  return undefined;
}

function dedupeCoins(coins: Record<string, unknown>[]) {
  const seen = new Set<string>();
  const unique: Record<string, unknown>[] = [];

  coins.forEach((coin) => {
    const key = buildCoinKey(coin);
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(coin);
  });

  return unique;
}

function appendUniqueCoins(
  target: Record<string, unknown>[],
  coins: Record<string, unknown>[],
) {
  const seen = new Set(target.map((coin) => buildCoinKey(coin)));

  coins.forEach((coin) => {
    const key = buildCoinKey(coin);
    if (seen.has(key)) return;
    seen.add(key);
    target.push(coin);
  });
}

function buildCoinKey(coin: Record<string, unknown>) {
  if (typeof coin.id === "string" && coin.id) {
    return coin.id;
  }

  const symbol =
    typeof coin.symbol === "string" && coin.symbol
      ? coin.symbol.toUpperCase()
      : "unknown";
  const rank =
    typeof coin.rank === "number" && Number.isFinite(coin.rank)
      ? coin.rank
      : "nr";

  return `${symbol}:${rank}`;
}

function shouldAttemptAdditionalFetch(
  meta: CoinsMetaPayload | undefined,
  currentLength: number,
  desiredLength: number,
) {
  if (currentLength >= desiredLength) {
    return false;
  }

  if (meta && typeof meta.hasNextPage === "boolean") {
    return meta.hasNextPage;
  }

  return true;
}

