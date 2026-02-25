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
    staleTime: 60_000,
    refetchInterval: 60_000,
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
        formatter: (value: number) => formatCurrency(value, data.currency, { notation: "compact", maximumFractionDigits: 2 }),
        tone: "emerald" as const,
      },
      {
        key: "volume24h",
        label: t("tableVolume24h"),
        value: data.volume24h,
        change: data.volumeChange24h,
        formatter: (value: number) => formatCurrency(value, data.currency, { notation: "compact", maximumFractionDigits: 2 }),
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
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("marketOverviewTitle")}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("marketOverviewSubtitle")}</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground/80">{summary}</p>
        {updatedAtLabel && (
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            {updatedAtLabel}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`market-overview-skeleton-${index}`} className="border-border/40 bg-card/50 p-6 backdrop-blur">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="mt-4 h-9 w-32 rounded-lg" />
              <Skeleton className="mt-4 h-6 w-20 rounded-full" />
            </Card>
          ))}
        </div>
      ) : isError || !data ? (
        <Card className="border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive backdrop-blur">
          {t("marketOverviewError")}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card
              key={metric.key}
              className={`relative overflow-hidden border-border/40 bg-card/60 p-5 backdrop-blur transition-all duration-300 hover:border-border/80 hover:shadow-lg ${buildCardClass()}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{metric.label}</div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl tabular-nums">
                {typeof metric.value === "number"
                  ? metric.formatter(metric.value)
                  : "—"}
              </div>
              <div className="mt-4">
                {typeof metric.change === "number" ? (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${buildChangeBadge(metric.change)}`}>
                    {metric.change > 0 ? "▲" : metric.change < 0 ? "▼" : ""} {Math.abs(metric.change).toFixed(2)}%
                  </span>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">—</span>
                )}
              </div>

              {/* Subtle background accent */}
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.03] blur-3xl pointer-events-none"
                style={{ backgroundColor: metric.change && metric.change > 0 ? '#10b981' : metric.change && metric.change < 0 ? '#f43f5e' : 'currentColor' }}
              />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function buildCardClass() {
  // We handle the background glow via inline styles now for more precision
  return "";
}

function buildChangeBadge(value: number) {
  if (value > 0) {
    return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  }

  if (value < 0) {
    return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  }

  return "bg-muted text-muted-foreground border border-border/40";
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
