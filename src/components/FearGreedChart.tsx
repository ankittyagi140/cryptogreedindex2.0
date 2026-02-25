"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Bar,
  Cell,
} from "recharts";
import type { TooltipProps } from "recharts";

import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartDataPoint {
  date: string;
  fear: number;
  price?: number | null;
  classificationKey?: string | null;
  classificationLabel?: string | null;
}

interface FearGreedChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

const CLASSIFICATION_COLORS: Record<string, string> = {
  extremeFear: "#ef4444",
  fear: "#f97316",
  neutral: "#eab308",
  greed: "#84cc16",
  extremeGreed: "#22c55e",
};

export default function FearGreedChart({
  data,
  loading = false,
}: FearGreedChartProps) {
  const { t } = useLanguage();
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const hasPrice = data.some(
    (point) => typeof point.price === "number" && !Number.isNaN(point.price),
  );

  const colors = useMemo(() => CLASSIFICATION_COLORS, []);

  const getColor = (classificationKey?: string | null) => {
    if (!classificationKey) return "#22c55e";
    return colors[classificationKey] ?? "#22c55e";
  };

  const CustomTooltip = ({
    active,
    payload,
  }: any) => {
    if (active && payload && payload.length) {
      const indexEntry = payload.find((item: any) => item.dataKey === "fear");
      const priceEntry = payload.find((item: any) => item.dataKey === "price");
      const classificationLabel =
        indexEntry?.payload?.classificationLabel ??
        indexEntry?.payload?.classificationKey;
      const classColor = getColor(indexEntry?.payload?.classificationKey);
      return (
        <div className="rounded-xl border border-border/60 bg-card/95 p-3.5 shadow-xl backdrop-blur-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {indexEntry?.payload?.date}
          </p>
          {classificationLabel && (
            <div className="mb-2 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: classColor }}
              />
              <span
                className="text-sm font-bold"
                style={{ color: classColor }}
              >
                {classificationLabel}
              </span>
            </div>
          )}
          {typeof indexEntry?.value === "number" && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">{t("fearGreedIndexLabel") ?? "Index"}:</span>{" "}
              <span className="font-semibold">{indexEntry.value}</span>
            </p>
          )}
          {typeof priceEntry?.value === "number" && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">{t("priceLabel") ?? "Price"}:</span>{" "}
              <span className="font-semibold text-blue-400">
                ${priceEntry.value.toLocaleString("en-US")}
              </span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Card className="border-border/50 bg-card/80 p-5 backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {t("chart")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Historical fear &amp; greed index with price overlay
            </p>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="w-full rounded-lg sm:w-32" data-testid="select-crypto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">BTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-[320px] sm:h-96">
          {loading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                {hasPrice && (
                  <YAxis
                    yAxisId="right"
                    fontSize={11}
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                )}
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Legend
                  wrapperStyle={{ paddingTop: 16 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="fear"
                  name={t("fearGreedIndexLabel") ?? "Index"}
                  yAxisId="left"
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.date}-${index}`}
                      fill={getColor(entry.classificationKey)}
                      opacity={0.85}
                    />
                  ))}
                </Bar>
                {hasPrice && (
                  <Line
                    dataKey="price"
                    dot={false}
                    name={t("priceLabel") ?? "Price"}
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    type="monotone"
                    yAxisId="right"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
