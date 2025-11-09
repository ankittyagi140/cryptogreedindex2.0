"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

type RainbowPoint = {
  date: string;
  price: number;
};

type RainbowApiResponse = {
  points: RainbowPoint[];
  source: "coinstats" | "fallback";
  meta?: { coinId: string; fetchedAt: string; error?: string };
};

const COINS = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "ethereum", label: "Ethereum" },
];

const FALLBACK_LABELS = {
  rainbowTitle: "Bitcoin Rainbow Chart",
  rainbowSubtitle:
    "Visualise Bitcoin's historical price in context with sentiment bands.",
  rainbowSelectCoin: "Select coin",
  rainbowError: "Unable to load rainbow chart data.",
} satisfies Record<string, string>;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
});

const halvingDates = [
  { date: "2012-11-28", label: "Halving" },
  { date: "2016-07-09", label: "Halving" },
  { date: "2020-05-11", label: "Halving" },
  { date: "2024-04-19", label: "Halving" },
];

export default function RainbowChart() {
  const { t } = useLanguage();
  const [coinId, setCoinId] = useState<string>("bitcoin");

  const translate = (key: string): string => {
    const value = t(key);
    if (value === key) {
      return FALLBACK_LABELS[key as keyof typeof FALLBACK_LABELS] ?? key;
    }
    return value;
  };

  const { data, isLoading, isError } = useQuery<RainbowApiResponse>({
    queryKey: ["rainbow", coinId],
    queryFn: async () => {
      const res = await fetch(`/api/btc-rainbow?coinId=${coinId}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    staleTime: 86_400_000,
    refetchInterval: 86_400_000,
  });

  const chartData = useMemo(() => {
    const points = (data?.points ?? []).filter(
      (p) =>
        Number.isFinite(p.price) &&
        typeof p.date === "string" &&
        !isNaN(new Date(p.date).getTime())
    );
    if (!points.length) return [];

    return points.map((p) => ({
      date: p.date,
      price: Math.max(Number(p.price), 1), // ✅ Prevent log(0)
    }));
  }, [data]);

  useEffect(() => {
    if (chartData.length) console.log("Chart sample:", chartData.slice(0, 5));
  }, [chartData]);

  const minValue = Math.min(...chartData.map((p) => p.price || 1));
  const maxValue = Math.max(...chartData.map((p) => p.price || 1));

  return (
    <Card className="border border-border/60 bg-background/60 p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {translate("rainbowTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {translate("rainbowSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {translate("rainbowSelectCoin")}
          </span>
          <Select value={coinId} onValueChange={setCoinId}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COINS.map((coin) => (
                <SelectItem key={coin.value} value={coin.value}>
                  {coin.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[560px] w-full">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : isError || !chartData.length ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-border/50 text-sm text-muted-foreground">
            {translate("rainbowError")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, bottom: 40, left: 24, right: 24 }}>
              <CartesianGrid
                stroke="rgba(148,163,184,0.18)"
                strokeDasharray="2 6"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(148,163,184,0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
                tickFormatter={(v: string) => dateFormatter.format(new Date(v))}
              />
              <YAxis
                stroke="rgba(148,163,184,0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                scale="log"
                domain={[Math.max(1, minValue * 0.8), maxValue * 1.2]}
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const entry = payload[0].payload as (typeof chartData)[number];
                    return (
                      <div className="rounded-md border border-border bg-background/95 px-3 py-2 text-sm shadow-lg">
                        <div className="font-medium text-foreground">{entry.date}</div>
                        <div className="mt-1 text-primary">
                          ${entry.price.toLocaleString("en-US")}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {halvingDates.map((event) => (
                <ReferenceLine
                  key={event.date}
                  x={event.date}
                  stroke="rgba(56,189,248,0.6)"
                  strokeDasharray="4 8"
                  strokeWidth={1}
                  label={{
                    value: event.label,
                    position: "top",
                    fill: "rgba(56,189,248,0.9)",
                    fontSize: 10,
                  }}
                />
              ))}

              <Area
                type="monotone"
                dataKey="price"
                stroke="rgba(96,165,250,0.95)"
                strokeWidth={2.5}
                fill="rgba(96,165,250,0.15)"
                isAnimationActive={false}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
