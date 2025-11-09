"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface MarketOverviewResponse {
  currency: string;
  marketCap?: number;
  marketCapChange24h?: number;
  volume24h?: number;
  volumeChange24h?: number;
  bitcoinDominance?: number;
  bitcoinDominanceChange24h?: number;
  updatedAt?: number;
}

interface MarketOverviewProps {
  currency?: string;
}

export default function MarketOverview({ currency = "USD" }: MarketOverviewProps) {
  const { t } = useLanguage();
  const currencyLabel = currency.toUpperCase();

  const { data, isLoading, isError } = useQuery<MarketOverviewResponse>({
    queryKey: ["coinstats-market-overview", { currency: currencyLabel }],
    queryFn: async () => {
      const response = await fetch(`/api/markets?currency=${currencyLabel}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return (await response.json()) as MarketOverviewResponse;
    },
    staleTime: 300_000,
    refetchInterval: 300_000,
  });

  const metrics = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        key: "marketCap",
        label: t("tableMarketCap"),
        value: data.marketCap,
        change: data.marketCapChange24h,
        formatter: (value: number) => formatCurrency(value, data.currency),
        tone: "emerald" as const,
      },
      {
        key: "volume24h",
        label: t("tableVolume24h"),
        value: data.volume24h,
        change: data.volumeChange24h,
        formatter: (value: number) => formatCurrency(value, data.currency),
        tone: "emerald" as const,
      },
      {
        key: "bitcoinDominance",
        label: t("btcDominanceLabel"),
        value: data.bitcoinDominance,
        change: data.bitcoinDominanceChange24h,
        formatter: (value: number) => formatPercent(value),
        tone: "rose" as const,
      },
    ];
  }, [data, t]);

  const summary = (() => {
    if (isLoading) {
      return t("marketOverviewLoading");
    }
    if (!data || isError) {
      return t("marketOverviewError");
    }

    return t("marketOverviewSummary", {
      marketCap: data.marketCap ? formatCurrency(data.marketCap, data.currency, { notation: "compact", maximumFractionDigits: 2 }) : "—",
      marketCapChange: data.marketCapChange24h !== undefined ? formatSignedPercent(data.marketCapChange24h) : "—",
      volume24h: data.volume24h ? formatCurrency(data.volume24h, data.currency, { notation: "compact", maximumFractionDigits: 2 }) : "—",
      btcDominance: data.bitcoinDominance !== undefined ? formatPercent(data.bitcoinDominance) : "—",
    });
  })();

  const updatedAtLabel =
    data?.updatedAt && !Number.isNaN(data.updatedAt)
      ? t("marketOverviewUpdatedAt", {
          time: new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "UTC",
          }).format(new Date(normalizeTimestamp(data.updatedAt))),
        })
      : undefined;

  return (
    <section className="mt-10 space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-foreground">{t("marketOverviewTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("marketOverviewSubtitle")}</p>
        <p className="mt-4 text-sm text-muted-foreground">{summary}</p>
        {updatedAtLabel && (
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground/80">
            {updatedAtLabel}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`market-overview-skeleton-${index}`} className="border border-border/60 bg-background/60 p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-8 w-32" />
              <Skeleton className="mt-3 h-5 w-20" />
            </Card>
          ))}
        </div>
      ) : isError || !data ? (
        <Card className="border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          {t("marketOverviewError")}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card
              key={metric.key}
              className={buildCardClass(metric.tone, metric.change)}
            >
              <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
              <div className="text-2xl font-semibold text-foreground">
                {typeof metric.value === "number"
                  ? metric.formatter(metric.value)
                  : "—"}
              </div>
              <div className="mt-4">
                {typeof metric.change === "number" ? (
                  <span className={buildChangeBadge(metric.change)}>
                    {formatSignedPercent(metric.change)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function buildCardClass(
  tone: "emerald" | "rose",
  change?: number,
) {
  const base = "rounded-2xl border p-5 shadow-sm transition-colors";
  const positive = "border-emerald-500/40 bg-emerald-500/12";
  const negative = "border-red-500/40 bg-red-500/12";
  const neutral = "border-border/60 bg-background/60";

  if (typeof change === "number") {
    if (change > 0) {
      return `${base} ${positive}`;
    }
    if (change < 0) {
      return `${base} ${negative}`;
    }
  }

  if (tone === "rose") {
    return `${base} border-rose-500/30 bg-rose-500/12`;
  }

  return `${base} ${neutral}`;
}

function buildChangeBadge(value: number) {
  if (value > 0) {
    return "inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/30";
  }

  if (value < 0) {
    return "inline-flex items-center rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-400 ring-1 ring-inset ring-red-500/30";
  }

  return "inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80";
}

function formatCurrency(
  value: number,
  currency = "USD",
  options?: Intl.NumberFormatOptions,
) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    notation: "standard",
    maximumFractionDigits: value < 1 ? 4 : 2,
    ...options,
  }).format(value);
}

function formatPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

function formatSignedPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }

  const sign = value > 0 ? "▲" : value < 0 ? "▼" : "";
  return `${sign ? `${sign} ` : ""}${Math.abs(value).toFixed(2)}%`;
}

function normalizeTimestamp(value: number) {
  // Handle seconds vs milliseconds
  return value > 1_000_000_000_000 ? value : value * 1000;
}


