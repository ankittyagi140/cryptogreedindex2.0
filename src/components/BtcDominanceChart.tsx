"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

export type BtcDominancePoint = {
  timestamp: number;
  dominance: number;
};

export type BtcDominanceApiResponse = {
  points: BtcDominancePoint[];
  source: "coinstats" | "fallback";
  meta?: {
    error?: string;
    fetchedAt?: string;
    period?: string;
  };
};

const PERIOD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "24h", label: "24H" },
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "All" },
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
});

const labels: Record<
  "title" | "subtitle" | "updated" | "selectPeriod" | "error" | "chartLabel",
  Record<Language, string>
> = {
  title: {
    en: "Bitcoin Dominance Chart",
    es: "Evolución de la dominancia de Bitcoin",
    pt: "Visão geral da dominância do Bitcoin",
    ja: "ビットコインドミナンス概要",
    ko: "비트코인 점유율 개요",
    hi: "बिटकॉइन प्रभुत्व अवलोकन",
    de: "Bitcoin-Dominanz Überblick",
    fr: "Vue d’ensemble de la dominance Bitcoin",
    zh: "比特币主导率概览",
  },
  subtitle: {
    en: "Track how Bitcoin’s market share shifts across different time frames.",
    es: "Sigue cómo cambia la cuota de mercado de Bitcoin en distintos periodos.",
    pt: "Acompanhe como a fatia de mercado do Bitcoin muda ao longo do tempo.",
    ja: "期間ごとのビットコイン市場シェアの推移を確認しましょう。",
    ko: "기간별 비트코인 점유율 변화를 살펴보세요.",
    hi: "विभिन्न समय अवधियों में बिटकॉइन की बाज़ार हिस्सेदारी कैसे बदलती है देखें।",
    de: "Verfolge, wie sich der Marktanteil von Bitcoin über verschiedene Zeiträume verändert.",
    fr: "Suivez l’évolution de la part de marché de Bitcoin selon les périodes.",
    zh: "查看比特币在不同时间段的市场份额变化。",
  },
  updated: {
    en: "Last updated {time}",
    es: "Última actualización {time}",
    pt: "Atualizado em {time}",
    ja: "最終更新 {time}",
    ko: "최근 업데이트 {time}",
    hi: "अंतिम अपडेट {time}",
    de: "Zuletzt aktualisiert {time}",
    fr: "Dernière mise à jour {time}",
    zh: "最近更新 {time}",
  },
  selectPeriod: {
    en: "Select period",
    es: "Seleccionar período",
    pt: "Selecionar período",
    ja: "期間を選択",
    ko: "기간 선택",
    hi: "अवधि चुनें",
    de: "Zeitraum wählen",
    fr: "Période",
    zh: "选择周期",
  },
  error: {
    en: "Unable to load BTC dominance right now.",
    es: "No se puede cargar la dominancia de BTC en este momento.",
    pt: "Não foi possível carregar a dominância do BTC agora.",
    ja: "現在、BTCドミナンスを読み込めません。",
    ko: "현재 BTC 도미넌스를 불러올 수 없습니다.",
    hi: "फिलहाल BTC प्रभुत्व लोड नहीं हो सका।",
    de: "BTC-Dominanz kann derzeit nicht geladen werden.",
    fr: "Impossible de charger la dominance BTC pour le moment.",
    zh: "目前无法加载 BTC 主导率。",
  },
  chartLabel: {
    en: "BTC Dominance (%)",
    es: "Dominancia BTC (%)",
    pt: "Dominância BTC (%)",
    ja: "BTC ドミナンス (%)",
    ko: "BTC 점유율 (%)",
    hi: "BTC प्रभुत्व (%)",
    de: "BTC-Dominanz (%)",
    fr: "Dominance BTC (%)",
    zh: "BTC 主导率 (%)",
  },
};

export default function BtcDominanceChart() {
  const { language } = useLanguage();
  const [period, setPeriod] = useState<string>("1y");

  const { data, isLoading, isError } = useQuery<BtcDominanceApiResponse>({
    queryKey: ["btc-dominance", period],
    queryFn: async () => {
      const response = await fetch(`/api/btc-dominance?period=${period}`);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json() as Promise<BtcDominanceApiResponse>;
    },
    staleTime: 86_400_000,
    refetchInterval: 86_400_000,
  });

  const chartData = useMemo(() => {
    const points = data?.points ?? [];
    return points.map((point, index) => {
      const previous = index > 0 ? points[index - 1] : undefined;
      const change =
        previous && typeof previous.dominance === "number"
          ? point.dominance - previous.dominance
          : 0;
      return {
        dateShort: dateFormatter.format(new Date(point.timestamp * 1000)),
        dateFull: dateTimeFormatter.format(new Date(point.timestamp * 1000)),
        dominance: point.dominance,
        change,
      };
    });
  }, [data]);

  const lastUpdated = data?.meta?.fetchedAt
    ? `${dateTimeFormatter.format(new Date(data.meta.fetchedAt))} UTC`
    : undefined;

  return (
    <Card className="border border-border/60 bg-background/60 p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {labels.title[language] ?? labels.title.en}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {labels.subtitle[language] ?? labels.subtitle.en}
          </p>
          {lastUpdated && (
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground/80">
              {(labels.updated[language] ?? labels.updated.en).replace(
                "{time}",
                lastUpdated,
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {labels.selectPeriod[language] ?? labels.selectPeriod.en}
          </span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[360px]">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : isError || !chartData.length ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-border/50 text-sm text-muted-foreground">
            {labels.error[language] ?? labels.error.en}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="btcDominanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={
                      chartData[chartData.length - 1]?.change >= 0
                        ? "#22c55e"
                        : "#ef4444"
                    }
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      chartData[chartData.length - 1]?.change >= 0
                        ? "#22c55e"
                        : "#ef4444"
                    }
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis
                dataKey="dateShort"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={60}
                unit="%"
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const entry = payload[0]?.payload as (typeof chartData)[number];
                    return (
                      <div className="rounded-md border border-border bg-background/95 px-3 py-2 text-sm shadow-lg">
                        <div className="font-medium text-foreground">
                          {entry.dateFull}
                        </div>
                        <div className="mt-1 text-primary">
                          {labels.chartLabel[language] ?? labels.chartLabel.en}:{" "}
                          {entry.dominance.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                          %
                        </div>
                        {typeof entry.change === "number" && (
                          <div
                            className={`mt-1 text-xs font-semibold ${
                              entry.change >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {entry.change >= 0 ? "▲" : "▼"}{" "}
                            {Math.abs(entry.change).toFixed(2)}%
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="dominance"
                stroke={
                  chartData[chartData.length - 1]?.change >= 0
                    ? "#22c55e"
                    : "#ef4444"
                }
                strokeWidth={2.2}
                fill="url(#btcDominanceFill)"
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

