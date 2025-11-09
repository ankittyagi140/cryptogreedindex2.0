const COINSTATS_BASE_URL = "https://openapiv1.coinstats.app";

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

export interface CoinStatsFearGreedPoint {
  value: number;
  value_classification: string;
  timestamp: number;
  update_time?: string;
}

export interface CoinStatsFearGreedResponse {
  name: string;
  now: CoinStatsFearGreedPoint;
  yesterday: CoinStatsFearGreedPoint;
  lastWeek: CoinStatsFearGreedPoint;
}

export interface CoinStatsFearGreedChartPoint {
  timestamp: number;
  value: number;
  value_classification?: string | null;
  price?: number | null;
}

export interface CoinStatsFearGreedChartResponse {
  points: CoinStatsFearGreedChartPoint[];
}

export interface CoinStatsPricePoint {
  timestamp: number;
  price: number;
}

export interface BtcDominancePoint {
  timestamp: number;
  dominance: number;
}

export interface RainbowPoint {
  date: string;
  price: number;
}

const FALLBACK_BASE_TIMESTAMP = Date.UTC(2024, 0, 1, 0, 0, 0) / 1000;

export function buildFearGreedFallbackData(): CoinStatsFearGreedResponse {
  const seconds = FALLBACK_BASE_TIMESTAMP;
  const iso = new Date(seconds * 1000).toISOString();

  return {
    name: "Fear and Greed Index",
    now: {
      value: 25,
      value_classification: "Extreme Fear",
      timestamp: seconds,
      update_time: iso,
    },
    yesterday: {
      value: 24,
      value_classification: "Extreme Fear",
      timestamp: seconds - 24 * 60 * 60,
    },
    lastWeek: {
      value: 83,
      value_classification: "Extreme Greed",
      timestamp: seconds - 7 * 24 * 60 * 60,
    },
  };
}

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]) {
  const url = new URL(path, COINSTATS_BASE_URL);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function fetchCoinStats<T>(
  path: string,
  { headers, searchParams, ...init }: FetchOptions = {},
): Promise<T> {
  const apiKey = process.env.COINSTATS_API_KEY;

  if (!apiKey) {
    throw new Error("COINSTATS_API_KEY is not set");
  }

  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
      ...headers,
    },
    cache: init.cache ?? "force-cache",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `CoinStats request failed (${response.status} ${response.statusText}): ${detail || "No response body"}`,
    );
  }

  return response.json() as Promise<T>;
}

function ensureNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function ensureTimestamp(value: unknown): number | undefined {
  const numeric = ensureNumber(value);
  if (numeric !== undefined) {
    return numeric;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return Math.floor(parsed / 1000);
    }
  }

  return undefined;
}

export function extractFearGreedChartPoints(
  raw: unknown,
): CoinStatsFearGreedChartPoint[] {
  const arrays: unknown[] = [];

  if (Array.isArray(raw)) {
    arrays.push(raw);
  } else if (raw && typeof raw === "object") {
    const container = raw as Record<string, unknown>;
    for (const key of ["points", "data", "chart", "values"]) {
      const candidate = container[key];
      if (Array.isArray(candidate)) {
        arrays.push(candidate);
      }
    }
  }

  if (arrays.length === 0) {
    return [];
  }

  const results: CoinStatsFearGreedChartPoint[] = [];

  for (const arr of arrays) {
    for (const item of arr as unknown[]) {
      if (!item || typeof item !== "object") continue;
      const obj = item as Record<string, unknown>;

      const timestamp =
        ensureTimestamp(obj.timestamp) ??
        ensureTimestamp(obj.time) ??
        ensureTimestamp(obj.date) ??
        ensureTimestamp(obj.createdAt);

      const value =
        ensureNumber(obj.value) ??
        ensureNumber(obj.index) ??
        ensureNumber(obj.score);

      if (timestamp === undefined || value === undefined) {
        continue;
      }

      const price =
        ensureNumber(obj.price) ??
        ensureNumber(obj.priceUsd) ??
        ensureNumber(obj.price_usd) ??
        ensureNumber(obj.btc_price) ??
        ensureNumber(
          typeof obj.price === "object" &&
            obj.price !== null &&
            "usd" in (obj.price as Record<string, unknown>)
            ? (obj.price as Record<string, unknown>).usd
            : undefined,
        );

      const valueClassification =
        (typeof obj.value_classification === "string" &&
          obj.value_classification) ||
        (typeof obj.classification === "string" && obj.classification) ||
        (typeof obj.valueClassification === "string" &&
          obj.valueClassification) ||
        null;

      results.push({
        timestamp,
        value,
        value_classification: valueClassification,
        price: price ?? null,
      });
    }
  }

  return results
    .filter(
      (point) =>
        Number.isFinite(point.timestamp) && Number.isFinite(point.value),
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function buildFearGreedChartFallbackData(): CoinStatsFearGreedChartPoint[] {
  const now = FALLBACK_BASE_TIMESTAMP * 1000;
  const day = 24 * 60 * 60 * 1000;

  const basePoints = [
    { offset: 11, value: 75, price: 95000 },
    { offset: 10, value: 50, price: 98000 },
    { offset: 9, value: 40, price: 105000 },
    { offset: 8, value: 30, price: 110000 },
    { offset: 7, value: 25, price: 115000 },
    { offset: 6, value: 35, price: 108000 },
    { offset: 5, value: 45, price: 112000 },
    { offset: 4, value: 60, price: 118000 },
    { offset: 3, value: 85, price: 122000 },
    { offset: 2, value: 70, price: 125000 },
    { offset: 1, value: 65, price: 120000 },
    { offset: 0, value: 27, price: 126000 },
  ];

  return basePoints.map(({ offset, value, price }) => {
    const timestamp = Math.floor((now - offset * day) / 1000);
    return {
      timestamp,
      value,
      price,
      value_classification:
        value <= 25
          ? "Extreme Fear"
          : value <= 45
          ? "Fear"
          : value <= 55
          ? "Neutral"
          : value <= 75
          ? "Greed"
          : "Extreme Greed",
    };
  });
}

export function buildPriceChartFallbackData(): CoinStatsPricePoint[] {
  return buildFearGreedChartFallbackData().map((point) => ({
    timestamp: point.timestamp,
    price: point.price ?? 0,
  }));
}

const BTC_DOMINANCE_PERIOD_INTERVAL_SECONDS: Record<string, number> = {
  "24h": 60 * 60,
  "1w": 6 * 60 * 60,
  "1m": 12 * 60 * 60,
  "3m": 24 * 60 * 60,
  "6m": 24 * 60 * 60,
  "1y": 24 * 60 * 60,
  all: 7 * 24 * 60 * 60,
};

const BTC_DOMINANCE_PERIOD_POINTS: Record<string, number> = {
  "24h": 24,
  "1w": 28,
  "1m": 60,
  "3m": 90,
  "6m": 180,
  "1y": 365,
  all: 520,
};

export function buildBtcDominanceFallbackData(
  period: string,
): BtcDominancePoint[] {
  const normalized = BTC_DOMINANCE_PERIOD_POINTS[period] ? period : "1y";
  const stepSeconds =
    BTC_DOMINANCE_PERIOD_INTERVAL_SECONDS[normalized] ?? 24 * 60 * 60;
  const total = BTC_DOMINANCE_PERIOD_POINTS[normalized] ?? 365;
  const now = FALLBACK_BASE_TIMESTAMP * 1000;

  return Array.from({ length: total }, (_, index) => {
    const timestamp = Math.floor(
      (now - (total - index) * stepSeconds * 1000) / 1000,
    );
    const base = 47 + 6 * Math.sin(index / 14);
    const trendAdjustment = (index / total) * 4;
    const dominance = Number((base + trendAdjustment).toFixed(2));
    return {
      timestamp,
      dominance,
    };
  });
}

export function extractPriceChartPoints(raw: unknown): CoinStatsPricePoint[] {
  const arrays: unknown[] = [];

  if (Array.isArray(raw)) {
    arrays.push(raw);
  } else if (raw && typeof raw === "object") {
    const container = raw as Record<string, unknown>;
    for (const key of ["chart", "charts", "data", "points", "prices"]) {
      const candidate = container[key];
      if (Array.isArray(candidate)) {
        arrays.push(candidate);
      }
    }

    const result = container.result;
    if (Array.isArray(result)) {
      arrays.push(result);
    } else if (result && typeof result === "object") {
      const nested = result as Record<string, unknown>;
      for (const key of ["chart", "charts", "data", "points", "prices"]) {
        const candidate = nested[key];
        if (Array.isArray(candidate)) {
          arrays.push(candidate);
        }
      }
    }
  }

  if (arrays.length === 0) {
    return [];
  }

  const results: CoinStatsPricePoint[] = [];

  for (const arr of arrays) {
    for (const item of arr as unknown[]) {
      if (Array.isArray(item) && item.length >= 2) {
        const [ts, value] = item;
        const timestamp = ensureTimestamp(ts);
        const price = ensureNumber(value);
        if (timestamp !== undefined && price !== undefined) {
          results.push({ timestamp, price });
        }
        continue;
      }

      if (!item || typeof item !== "object") continue;
      const obj = item as Record<string, unknown>;

      const timestamp =
        ensureTimestamp(obj.timestamp) ??
        ensureTimestamp(obj.time) ??
        ensureTimestamp(obj.date);

      const price =
        ensureNumber(obj.price) ??
        ensureNumber(obj.priceUsd) ??
        ensureNumber(obj.price_usd) ??
        ensureNumber(
          typeof obj.price === "object" &&
            obj.price !== null &&
            "usd" in (obj.price as Record<string, unknown>)
            ? (obj.price as Record<string, unknown>).usd
            : undefined,
        );

      if (timestamp !== undefined && price !== undefined) {
        results.push({ timestamp, price });
      }
    }
  }

  return results
    .filter(
      (point) =>
        Number.isFinite(point.timestamp) && Number.isFinite(point.price),
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function mergeFearGreedWithPrice(
  fearGreed: CoinStatsFearGreedChartPoint[],
  prices: CoinStatsPricePoint[],
): CoinStatsFearGreedChartPoint[] {
  if (!prices.length) {
    return fearGreed;
  }

  const priceMap = new Map<number, number>();
  prices.forEach((point) => {
    priceMap.set(point.timestamp, point.price);
  });

  const sortedPrices = prices.slice().sort((a, b) => a.timestamp - b.timestamp);

  return fearGreed.map((point) => {
    if (typeof point.price === "number" && Number.isFinite(point.price)) {
      return point;
    }

    const timestamp = point.timestamp;
    if (priceMap.has(timestamp)) {
      return { ...point, price: priceMap.get(timestamp) ?? null };
    }

    const nearest = findNearestPrice(sortedPrices, timestamp);
    return { ...point, price: nearest ?? null };
  });
}

function findNearestPrice(
  prices: CoinStatsPricePoint[],
  timestamp: number,
): number | undefined {
  if (!prices.length) return undefined;

  let left = 0;
  let right = prices.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midTimestamp = prices[mid].timestamp;

    if (midTimestamp === timestamp) {
      return prices[mid].price;
    }

    if (midTimestamp < timestamp) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  const candidates = [prices[right], prices[left]].filter(Boolean);

  let best: CoinStatsPricePoint | undefined;
  let minDiff = Number.POSITIVE_INFINITY;

  for (const candidate of candidates as CoinStatsPricePoint[]) {
    const diff = Math.abs(candidate.timestamp - timestamp);
    if (diff < minDiff) {
      minDiff = diff;
      best = candidate;
    }
  }

  return best?.price;
}

export function extractBtcDominancePoints(raw: unknown): BtcDominancePoint[] {
  const arrays: unknown[] = [];

  const addCandidate = (candidate: unknown) => {
    if (Array.isArray(candidate)) {
      arrays.push(candidate);
    }
  };

  addCandidate(raw);

  if (raw && typeof raw === "object") {
    const container = raw as Record<string, unknown>;
    addCandidate(container.data);
    addCandidate(container.result);

    for (const key of Object.keys(container)) {
      const value = container[key];
      if (value && typeof value === "object") {
        const nested = value as Record<string, unknown>;
        addCandidate(nested.data);
      }
    }
  }

  if (!arrays.length) {
    return [];
  }

  const points: BtcDominancePoint[] = [];

  for (const arr of arrays) {
    for (const item of arr as unknown[]) {
      if (Array.isArray(item) && item.length >= 2) {
        const [ts, dominanceValue] = item;
        const timestamp = ensureTimestamp(ts);
        const dominance = ensureNumber(dominanceValue);
        if (timestamp !== undefined && dominance !== undefined) {
          points.push({ timestamp, dominance });
        }
        continue;
      }

      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const timestamp =
          ensureTimestamp(obj.timestamp) ??
          ensureTimestamp(obj.time) ??
          ensureTimestamp(obj.date);
        const dominance =
          ensureNumber(obj.dominance) ??
          ensureNumber(obj.percentage) ??
          ensureNumber(obj.value);

        if (timestamp !== undefined && dominance !== undefined) {
          points.push({ timestamp, dominance });
        }
      }
    }
  }

  return points
    .filter(
      (point) =>
        Number.isFinite(point.timestamp) && Number.isFinite(point.dominance),
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function extractRainbowPoints(raw: unknown): RainbowPoint[] {
  if (!raw || typeof raw !== "object") {
    return [];
  }

  const container = raw as Record<string, unknown>;
  const arrays: unknown[] = [];

  const addCandidate = (candidate: unknown) => {
    if (Array.isArray(candidate)) {
      arrays.push(candidate);
    }
  };

  addCandidate(raw);
  addCandidate(container.data);
  addCandidate(container.result);

  for (const key of Object.keys(container)) {
    const value = container[key];
    if (value && typeof value === "object") {
      addCandidate((value as Record<string, unknown>).data);
    }
  }

  if (!arrays.length) {
    return [];
  }

  const points: RainbowPoint[] = [];

  for (const arr of arrays) {
    for (const entry of arr as unknown[]) {
      if (!entry || typeof entry !== "object") continue;
      const obj = entry as Record<string, unknown>;
      const price = ensureNumber(obj.price);
      const time = typeof obj.time === "string" ? obj.time : undefined;
      if (price !== undefined && time) {
        points.push({ price, date: time });
      }
    }
  }

  return points
    .filter((point) => Number.isFinite(point.price) && point.date.length > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function buildRainbowFallbackData(coinId: string): RainbowPoint[] {
  const start = new Date("2013-01-01").getTime();
  const points: RainbowPoint[] = [];

  for (let i = 0; i < 120; i += 1) {
    const date = new Date(start + i * 30 * 24 * 60 * 60 * 1000);
    const yearFactor = i / 12;
    const base =
      coinId === "ethereum"
        ? 50 * Math.exp(yearFactor * 0.18)
        : 100 * Math.exp(yearFactor * 0.16);
    const noise = 1 + 0.15 * Math.sin(i / 4);
    points.push({
      date: date.toISOString().slice(0, 10),
      price: Number((base * noise).toFixed(2)),
    });
  }

  return points;
}

