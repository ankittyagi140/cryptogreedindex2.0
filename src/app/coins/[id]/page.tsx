import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchCoinStatsMarket } from "@/lib/coinstats-market";
import { extractPriceChartPoints } from "@/lib/coinstats";

type CoinDetail = {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  price?: number;
  priceBtc?: number;
  rank?: number;
  volume?: number;
  marketCap?: number;
  availableSupply?: number;
  totalSupply?: number;
  fullyDilutedValuation?: number;
  priceChange1h?: number;
  priceChange1d?: number;
  priceChange1w?: number;
  contractAddress?: string | null;
  contractAddresses?: { blockchain: string; contractAddress: string }[];
  websiteUrl?: string;
  redditUrl?: string;
  twitterUrl?: string;
  explorers?: string[];
  categories?: string[];
  description?: string;
};

type CoinPricePoint = {
  timestamp: number;
  price: number;
};

const DEFAULT_CURRENCY = "USD";
const DEFAULT_CHART_PERIOD = "1w";
const DEFAULT_CHART_INTERVAL = "1h";

export const revalidate = 300;

interface CoinPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ period?: string; interval?: string; currency?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const coin = await getCoin(id);
  if (!coin) {
    return {
      title: "Coin not found • Crypto Fear and Greed Index",
    };
  }

  const price =
    typeof coin.price === "number"
      ? formatCurrency(coin.price, DEFAULT_CURRENCY)
      : undefined;

  return {
    title: `${coin.name} (${coin.symbol?.toUpperCase()}) Price Today`,
    description: price
      ? `Live ${coin.name} price today is ${price}. Track ${coin.symbol?.toUpperCase()} market cap, volume, and performance with charts powered by CoinStats.`
      : `Track ${coin.name} (${coin.symbol?.toUpperCase()}) market data with charts powered by CoinStats.`,
    openGraph: {
      title: `${coin.name} Price Today`,
      description: price
        ? `${coin.name} live price is ${price}. View market stats, supply, and latest performance.`
        : undefined,
    },
  };
}

export default async function CoinDetailPage({
  params,
  searchParams,
}: CoinPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const coin = await getCoin(id);

  if (!coin) {
    notFound();
  }

  const currency = (resolvedSearchParams.currency ?? DEFAULT_CURRENCY).toUpperCase();
  const chartPeriod = resolvedSearchParams.period ?? DEFAULT_CHART_PERIOD;
  const chartInterval = resolvedSearchParams.interval ?? DEFAULT_CHART_INTERVAL;

  const chartPoints = await getCoinChart(id, {
    period: chartPeriod,
    interval: chartInterval,
    currency,
  });

  const price = typeof coin.price === "number" ? coin.price : undefined;
  const formattedPrice = price
    ? formatCurrency(price, currency)
    : "Price unavailable";
  const formattedBtcPrice =
    typeof coin.priceBtc === "number"
      ? `${coin.priceBtc.toFixed(8)} BTC`
      : undefined;

  return (
    <div className="bg-gradient-to-b from-background via-background/95 to-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {coin.icon ? (
              <Image
                src={coin.icon}
                alt={coin.name}
                width={72}
                height={72}
                className="h-16 w-16 rounded-full border border-border/40 bg-background p-2"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/40 bg-background">
                <span className="text-lg font-medium">
                  {coin.symbol?.slice(0, 3).toUpperCase() ?? "?"}
                </span>
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  {coin.name}
                </h1>
                {coin.symbol && (
                  <span className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
                    {coin.symbol}
                  </span>
                )}
                {typeof coin.rank === "number" && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Rank #{coin.rank}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Real-time market data provided by CoinStats API.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
            <span className="text-xs uppercase text-muted-foreground">
              Price ({currency})
            </span>
            <span className="text-4xl font-bold text-foreground">
              {formattedPrice}
            </span>
            {formattedBtcPrice && (
              <span className="text-sm text-muted-foreground">
                {formattedBtcPrice}
              </span>
            )}
            <div className="flex flex-wrap gap-3 text-sm">
              {renderChangeBadge("1h", coin.priceChange1h)}
              {renderChangeBadge("24h", coin.priceChange1d)}
              {renderChangeBadge("7d", coin.priceChange1w)}
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {coin.name} Price Chart
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Period: {chartPeriod.toUpperCase()}</span>
                <span>Interval: {chartInterval}</span>
              </div>
            </div>
            <div className="mt-6 h-64 w-full">
              {chartPoints.length ? (
                <PriceAreaChart prices={chartPoints} />
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border/70 text-sm text-muted-foreground">
                  Price chart unavailable
                </div>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Key Metrics
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <MetricRow
                  label="Market Cap"
                  value={formatNumberCompact(coin.marketCap, currency)}
                />
                <MetricRow
                  label="24h Volume"
                  value={formatNumberCompact(coin.volume, currency)}
                />
                <MetricRow
                  label="Circulating Supply"
                  value={formatNumber(coin.availableSupply)}
                />
                <MetricRow
                  label="Total Supply"
                  value={formatNumber(coin.totalSupply)}
                />
                <MetricRow
                  label="Fully Diluted Valuation"
                  value={formatNumberCompact(
                    coin.fullyDilutedValuation,
                    currency,
                  )}
                />
              </dl>
            </div>

            <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Links
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {coin.websiteUrl && (
                  <li>
                    <ExternalLink href={coin.websiteUrl} label="Website" />
                  </li>
                )}
                {coin.twitterUrl && (
                  <li>
                    <ExternalLink href={coin.twitterUrl} label="Twitter" />
                  </li>
                )}
                {coin.redditUrl && (
                  <li>
                    <ExternalLink href={coin.redditUrl} label="Reddit" />
                  </li>
                )}
                {coin.explorers?.length ? (
                  <li>
                    <span className="text-muted-foreground">Explorers:</span>
                    <ul className="mt-2 space-y-1">
                      {coin.explorers.slice(0, 5).map((url) => (
                        <li key={url}>
                          <ExternalLink href={url} label={url} />
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : null}
              </ul>
            </div>

            {coin.contractAddresses?.length ? (
              <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Contract Addresses
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {coin.contractAddresses.slice(0, 6).map((entry) => (
                    <li key={`${entry.blockchain}:${entry.contractAddress}`}>
                      <span className="text-muted-foreground">
                        {entry.blockchain}:
                      </span>{" "}
                      <code className="break-all text-xs text-foreground">
                        {entry.contractAddress}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </section>
      </div>
    </div>
  );
}

async function getCoin(id: string) {
  const normalized = id.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  try {
    const data = await fetchCoinStatsMarket<Record<string, unknown>>(
      `/coins/${normalized}`,
      {
        searchParams: { currency: DEFAULT_CURRENCY },
      },
    );

    const resultCandidate = data.result;

    const coinRecord =
      (resultCandidate && typeof resultCandidate === "object"
        ? (resultCandidate as Record<string, unknown>)
        : undefined) ?? data;

    if (!coinRecord || typeof coinRecord !== "object") {
      return null;
    }

    return coinRecord as CoinDetail;
  } catch (error) {
    console.error(`Failed to fetch coin ${normalized}`, error);
    return null;
  }
}

async function getCoinChart(
  id: string,
  {
    period,
    interval,
    currency,
  }: { period: string; interval: string; currency: string },
) {
  const normalized = id.trim().toLowerCase();
  if (!normalized) return [];

  try {
    const chartRaw = await fetchCoinStatsMarket<unknown>(
      `/coins/${normalized}/charts`,
      {
        searchParams: {
          period,
          interval,
          currency: currency.toLowerCase(),
        },
      },
    );

    const points = extractPriceChartPoints(chartRaw);
    return points;
  } catch (error) {
    console.error(`Failed to fetch chart for ${normalized}`, error);
    return [];
  }
}

function MetricRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">
        {value ?? "Unavailable"}
      </dd>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

function renderChangeBadge(label: string, value?: number) {
  if (typeof value !== "number") {
    return null;
  }

  const formatted = `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  const badgeClass =
    value > 0
      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30"
      : value < 0
      ? "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/30"
      : "bg-muted text-muted-foreground";

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}>
      {label}: {formatted}
    </span>
  );
}

function formatCurrency(value?: number, currency = DEFAULT_CURRENCY) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

function formatNumberCompact(value?: number, currency = DEFAULT_CURRENCY) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value);
}

function PriceAreaChart({ prices }: { prices: CoinPricePoint[] }) {
  const width = 960;
  const height = 240;

  if (!prices.length) {
    return null;
  }

  const values = prices.map((point) => point.price);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const areaPoints = prices
    .map((point, index) => {
      const x = (index / (prices.length - 1 || 1)) * width;
      const y = height - ((point.price - minValue) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const lineColor =
    prices[prices.length - 1].price - prices[0].price >= 0
      ? "#22c55e"
      : "#ef4444";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="coin-chart-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
          <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#coin-chart-gradient)"
        points={`0,${height} ${areaPoints} ${width},${height}`}
      />
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={areaPoints}
      />
    </svg>
  );
}


