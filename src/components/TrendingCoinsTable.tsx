'use client';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface CoinStatsCoin {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  rank: number;
  price: number;
  priceChange1h: number | null;
  priceChange1d: number | null;
  priceChange1w: number | null;
  marketCap?: number;
  volume?: number;
  sparkline: number[];
}

interface CoinsMeta {
  page: number;
  limit: number;
  itemCount?: number;
  pageCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

interface CoinsApiResponse {
  coins: CoinStatsCoin[];
  meta?: CoinsMeta;
}

interface TrendingCoinsTableProps {
  perPage?: number;
  title?: string;
  subtitle?: string;
  showSeeMore?: boolean;
  seeMoreHref?: string;
  enablePagination?: boolean;
  currency?: string;
  containerClassName?: string;
}

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function formatNumberCompact(value: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  const rounded = Math.abs(value).toFixed(2);
  if (value > 0) return `▲ ${rounded}%`;
  if (value < 0) return `▼ ${rounded}%`;
  return `${rounded}%`;
}

function getPercentColor(value: number) {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-muted-foreground";
}

function renderChange(value: number | null | undefined) {
  if (typeof value !== "number") {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <span className={`${getPercentColor(value)} font-medium`}>
      {formatPercent(value)}
    </span>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) {
    return <div className="text-muted-foreground">—</div>;
  }

  const width = 140;
  const height = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const gradientId = `spark-${Math.random().toString(36).slice(2)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-10 w-32"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        fill={`url(#${gradientId})`}
        stroke="none"
        points={`0,${height} ${points} ${width},${height}`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

export default function TrendingCoinsTable({
  perPage = 10,
  title,
  subtitle,
  showSeeMore = true,
  seeMoreHref = "/coins",
  enablePagination = false,
  currency = "USD",
  containerClassName,
}: TrendingCoinsTableProps) {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const currencyLabel = currency.toUpperCase();
  const effectivePage = enablePagination ? page : 1;
  const computedTitle = title ?? t("topCoinsTitle");
  const computedSubtitle = subtitle ?? t("topCoinsSubtitle");
  const effectivePerPage = enablePagination ? localPerPage : perPage;

  const { data, isLoading, isError, isFetching } = useQuery<CoinsApiResponse>({
    queryKey: [
      "coinstats-coins",
      { perPage: effectivePerPage, page: effectivePage, currency: currencyLabel },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(effectivePerPage),
        page: String(effectivePage),
        currency: currencyLabel,
        sortBy: "marketCap",
        sortDir: "desc",
      });

      const response = await fetch(`/api/coins?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const body: Record<string, unknown> = await response.json();

      const rawCoins =
        (Array.isArray(body.result) && (body.result as unknown[])) ||
        (body.result && typeof body.result === "object"
          ? ((body.result as Record<string, unknown>).coins as unknown[])
          : undefined) ||
        (Array.isArray(body.coins) ? (body.coins as unknown[]) : []);

      if (!rawCoins.length) {
        throw new Error("No coins returned");
      }

      const coins: CoinStatsCoin[] = rawCoins.map((coin, index) => {
        const record = coin as Record<string, unknown>;
        const sparkline = Array.isArray(record.sparkline)
          ? (record.sparkline as number[])
          : [];

        return {
          id: String(record.id ?? index),
          icon: String(record.icon ?? ""),
          name: String(record.name ?? record.symbol ?? "Unknown"),
          symbol: String(record.symbol ?? "").toUpperCase(),
          rank:
            typeof record.rank === "number"
              ? record.rank
              : (effectivePage - 1) * effectivePerPage + index + 1,
          price: Number(record.price ?? 0),
          priceChange1h:
            typeof record.priceChange1h === "number"
              ? record.priceChange1h
              : null,
          priceChange1d:
            typeof record.priceChange1d === "number"
              ? record.priceChange1d
              : null,
          priceChange1w:
            typeof record.priceChange1w === "number"
              ? record.priceChange1w
              : null,
          marketCap:
            typeof record.marketCap === "number" ? record.marketCap : undefined,
          volume:
            typeof record.volume === "number" ? record.volume : undefined,
          sparkline,
        };
      });

      const rawMeta =
        (body.meta as CoinsMeta | undefined) ||
        ((body.result && typeof body.result === "object"
          ? (body.result as Record<string, unknown>).meta
          : undefined) as CoinsMeta | undefined);

      const meta: CoinsMeta | undefined = rawMeta
        ? {
            page: Number(rawMeta.page ?? effectivePage),
            limit: Number(rawMeta.limit ?? effectivePerPage),
            itemCount: rawMeta.itemCount,
            pageCount: rawMeta.pageCount,
            hasPreviousPage: rawMeta.hasPreviousPage,
            hasNextPage: rawMeta.hasNextPage,
          }
        : {
            page: effectivePage,
            limit: effectivePerPage,
            hasPreviousPage: effectivePage > 1,
            hasNextPage: coins.length === effectivePerPage,
          };

      return { coins, meta };
    },
    placeholderData: enablePagination ? keepPreviousData : undefined,
    staleTime: 300_000,
    refetchInterval: 300_000,
  });

  const coins = data?.coins ?? [];
  const meta = data?.meta;
  const totalPages = useMemo(() => {
    if (!meta) return undefined;
    if (meta.pageCount) return meta.pageCount;
    if (meta.itemCount) {
      return Math.ceil(meta.itemCount / meta.limit);
    }
    return undefined;
  }, [meta]);

  const canPrev = enablePagination
    ? meta?.hasPreviousPage ?? effectivePage > 1
    : false;
  const canNext = enablePagination
    ? meta?.hasNextPage ?? (totalPages ? effectivePage < totalPages : coins.length >= effectivePerPage)
    : false;

  const sectionClassName =
    containerClassName ?? "mx-auto w-full max-w-7xl px-6 py-16 lg:py-20";

  return (
    <section className={sectionClassName}>
      <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center lg:flex-row lg:text-left">
        <h2 className="font-display text-3xl font-bold text-center md:text-4xl">
          {computedTitle}
        </h2>
        <p className="mt-3 text-muted-foreground text-center">{computedSubtitle}</p>

        {enablePagination && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("tablePerPageLabel", { count: effectivePerPage }) ?? "Per page"}</span>
            <Select
              value={String(effectivePerPage)}
              onValueChange={(value) => {
                const numeric = Number(value);
                setLocalPerPage(numeric);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-24" data-testid="select-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 40, 50, 80, 100].map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card className="overflow-hidden border border-border/60 bg-background/60">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed text-sm text-muted-foreground">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t("tableRank")}</th>
                <th className="px-4 py-3 text-left font-medium">{t("tableName")}</th>
                <th className="px-4 py-3 text-right font-medium">
                  {t("tablePrice", { currency: currencyLabel })}
                </th>
                <th className="px-4 py-3 text-right font-medium">{t("tableChange1h")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("tableChange24h")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("tableChange7d")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("tableMarketCap")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("tableVolume24h")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("tablePriceGraph")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: effectivePerPage }).map((_, index) => (
                  <tr key={`row-skeleton-${index}`} className="border-t">
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-6" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="ml-auto h-4 w-24" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="ml-auto h-4 w-24" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="ml-auto h-4 w-28" />
                    </td>
                  </tr>
                ))}

              {!isLoading && isError && (
                <tr className="border-t">
                  <td
                    colSpan={9}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    {t("tableLoadError")}
                  </td>
                </tr>
              )}

              {!isLoading && !isError &&
                coins.map((coin) => (
                  <tr
                    key={coin.id}
                    className="border-t border-border/30 text-foreground"
                  >
                    <td className="px-4 py-4">{coin.rank}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/coins/${coin.id}`}
                        className="flex items-center gap-3 transition-colors hover:text-foreground"
                      >
                        <Image
                          src={coin.icon}
                          alt={coin.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-xs uppercase text-muted-foreground">
                            {coin.symbol}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {formatCurrency(coin.price, currencyLabel)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {renderChange(coin.priceChange1h)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {renderChange(coin.priceChange1d)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {renderChange(coin.priceChange1w)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {typeof coin.marketCap === "number"
                        ? formatNumberCompact(coin.marketCap, currencyLabel)
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {typeof coin.volume === "number"
                        ? formatNumberCompact(coin.volume, currencyLabel)
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        {coin.sparkline.length ? (
                          <Sparkline
                            data={coin.sparkline}
                            color={
                              coin.sparkline[coin.sparkline.length - 1] -
                                coin.sparkline[0] >=
                              0
                                ? "#22c55e"
                                : "#ef4444"
                            }
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {enablePagination && (
        <div className="mt-6 flex flex-col items-center gap-4 text-sm text-muted-foreground md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            {t("paginationPage", { page: effectivePage })}
            {totalPages ? t("paginationOf", { total: totalPages }) : ""}
            {meta?.itemCount
              ? t("paginationAssets", { count: meta.itemCount.toLocaleString() })
              : ""}
            {isFetching ? t("paginationUpdating") : ""}
          </div>
          <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={!canPrev || isFetching}
          >
            {t("previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!canNext || isFetching}
          >
            {t("next")}
          </Button>
          </div>
        </div>
      )}

      {showSeeMore && !enablePagination && (
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href={seeMoreHref}>{t("seeMoreCoins")}</Link>
          </Button>
        </div>
      )}
    </section>
  );
}