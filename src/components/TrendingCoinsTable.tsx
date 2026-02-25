'use client';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
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


function getPercentColor(value: number) {
  if (value > 0) return "text-emerald-500";
  if (value < 0) return "text-rose-500";
  return "text-muted-foreground";
}

function renderChange(value: number | null | undefined) {
  if (typeof value !== "number") {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <span className={`${getPercentColor(value)} font-bold tabular-nums`}>
      {value > 0 ? "▲" : value < 0 ? "▼" : ""} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function Sparkline({
  data,
  color,
  className,
}: {
  data: number[];
  color: string;
  className?: string;
}) {
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
      className={className ?? "h-10 w-32"}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
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
        strokeWidth={1.5}
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
    staleTime: 60_000,
    refetchInterval: 60_000,
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
    containerClassName ?? "mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-20";

  return (
    <section className={sectionClassName}>
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {computedTitle}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{computedSubtitle}</p>
        </div>

        {enablePagination && (
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {t("tablePerPageLabel", { count: effectivePerPage }) ?? "Per page"}
            </span>
            <Select
              value={String(effectivePerPage)}
              onValueChange={(value) => {
                const numeric = Number(value);
                setLocalPerPage(numeric);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-20 rounded-lg h-9" data-testid="select-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card className="hidden overflow-hidden border-border/40 bg-card/60 backdrop-blur md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/40 bg-muted/40 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
              <tr>
                <th className="px-6 py-4 text-left font-bold w-12">#</th>
                <th className="px-6 py-4 text-left font-bold">{t("tableName")}</th>
                <th className="px-6 py-4 text-right font-bold">
                  {t("tablePrice", { currency: currencyLabel })}
                </th>
                <th className="px-6 py-4 text-right font-bold">{t("tableChange1h")}</th>
                <th className="px-6 py-4 text-right font-bold">{t("tableChange24h")}</th>
                <th className="px-6 py-4 text-right font-bold">{t("tableChange7d")}</th>
                <th className="px-6 py-4 text-right font-bold">{t("tableMarketCap")}</th>
                <th className="px-6 py-4 text-right font-bold lg:w-40">{t("tablePriceGraph")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading &&
                Array.from({ length: effectivePerPage }).map((_, index) => (
                  <tr key={`row-skeleton-${index}`}>
                    <td className="px-6 py-5">
                      <Skeleton className="h-4 w-4 rounded" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-16 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Skeleton className="ml-auto h-4 w-20 rounded" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Skeleton className="ml-auto h-4 w-16 rounded" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Skeleton className="ml-auto h-4 w-16 rounded" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Skeleton className="ml-auto h-4 w-16 rounded" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Skeleton className="ml-auto h-4 w-24 rounded" />
                    </td>
                    <td className="px-6 py-5">
                      <Skeleton className="ml-auto h-8 w-28 rounded-lg" />
                    </td>
                  </tr>
                ))}

              {!isLoading && isError && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    {t("tableLoadError")}
                  </td>
                </tr>
              )}

              {!isLoading && !isError &&
                coins.map((coin) => (
                  <tr
                    key={coin.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4 font-medium text-muted-foreground/50 tabular-nums text-xs">{coin.rank}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/coins/${coin.id}`}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={coin.icon}
                          alt={coin.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full bg-white/10 p-0.5"
                        />
                        <div>
                          <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{coin.name}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            {coin.symbol}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground tabular-nums text-sm">
                      {formatCurrency(coin.price, currencyLabel)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {renderChange(coin.priceChange1h)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {renderChange(coin.priceChange1d)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {renderChange(coin.priceChange1w)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-muted-foreground tabular-nums text-sm">
                      {typeof coin.marketCap === "number"
                        ? formatNumberCompact(coin.marketCap, currencyLabel)
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        {coin.sparkline.length ? (
                          <Sparkline
                            data={coin.sparkline}
                            color={
                              coin.sparkline[coin.sparkline.length - 1] -
                                coin.sparkline[0] >=
                                0
                                ? "#10b981"
                                : "#f43f5e"
                            }
                            className="h-9 w-28"
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

      {/* Mobile view cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={`mobile-skeleton-${index}`}
              className="border-border/40 bg-card/50 p-5 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <Skeleton className="h-5 w-8 rounded" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </Card>
          ))}

        {!isLoading &&
          !isError &&
          coins.map((coin) => (
            <Link
              key={`mobile-card-${coin.id}`}
              href={`/coins/${coin.id}`}
              className="block"
            >
              <Card className="group relative overflow-hidden border-border/40 bg-card/60 p-5 backdrop-blur transition-all active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={coin.icon}
                      alt={coin.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full bg-white/10 p-0.5"
                    />
                    <div>
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {coin.name}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground/50">
                    #{coin.rank}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
                      {t("tablePrice", { currency: currencyLabel })}
                    </p>
                    <p className="font-bold text-foreground tabular-nums">
                      {formatCurrency(coin.price, currencyLabel)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
                      {t("tableChange24h")}
                    </p>
                    <div>{renderChange(coin.priceChange1d)}</div>
                  </div>
                  <div className="col-span-2 border-t border-border/20 pt-4 mt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
                          Market Cap
                        </p>
                        <p className="font-semibold text-muted-foreground tabular-nums">
                          {typeof coin.marketCap === "number"
                            ? formatNumberCompact(coin.marketCap, currencyLabel)
                            : "—"}
                        </p>
                      </div>
                      <div className="w-24">
                        {coin.sparkline.length ? (
                          <Sparkline
                            data={coin.sparkline}
                            color={
                              coin.sparkline[coin.sparkline.length - 1] -
                                coin.sparkline[0] >=
                                0
                                ? "#10b981"
                                : "#f43f5e"
                            }
                            className="h-8 w-full"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
      </div>

      {enablePagination && (
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-border/30 pt-8 md:flex-row">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            {t("paginationPage", { page: effectivePage })}
            {totalPages ? t("paginationOf", { total: totalPages }) : ""}
            {meta?.itemCount
              ? ` • ${meta.itemCount.toLocaleString("en-US")} assets`
              : ""}
            {isFetching ? " • Updating..." : ""}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg px-4 h-9 gap-2"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!canPrev || isFetching}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg px-4 h-9 gap-2"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!canNext || isFetching}
            >
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {showSeeMore && !enablePagination && (
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-wider text-xs border-border/60 hover:border-primary/50 transition-all hover:shadow-lg active:scale-95">
            <Link href={seeMoreHref} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t("seeMoreCoins")}
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}