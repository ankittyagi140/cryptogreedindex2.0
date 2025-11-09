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
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const indexEntry = payload.find((item) => item.dataKey === "fear");
      const priceEntry = payload.find((item) => item.dataKey === "price");
      const classificationLabel =
        indexEntry?.payload?.classificationLabel ??
        indexEntry?.payload?.classificationKey;
      return (
        <div className="rounded-md border border-card-border bg-card p-3 shadow-lg">
          <p className="mb-1 text-sm font-medium">
            {indexEntry?.payload?.date}
          </p>
          {classificationLabel && (
            <p
              className="text-sm font-semibold"
              style={{
                color: getColor(indexEntry?.payload?.classificationKey),
              }}
            >
              {classificationLabel}
            </p>
          )}
          {typeof indexEntry?.value === "number" && (
          <p className="text-sm text-green-500">
              {t("fearGreedIndexLabel") ?? "Index"}:{" "}
              {indexEntry.value.toLocaleString("en-US")}
          </p>
          )}
          {typeof priceEntry?.value === "number" && (
          <p className="text-sm text-blue-500">
              {t("priceLabel") ?? "Price"}: $
              {priceEntry.value.toLocaleString("en-US")}
          </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <Card className="p-5 sm:p-8">
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {t("chart")}
          </h2>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="w-full sm:w-32" data-testid="select-crypto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="BTC">☀️ BTC</SelectItem>
                  {/* <SelectItem value="ETH">💎 ETH</SelectItem>
                  <SelectItem value="SOL"> SOL</SelectItem> */}
              </SelectContent>
            </Select>
            {/* <SocialShareMenu
              title={t("chart")}
              description={t("description")}
              variant="outline"
              size="sm"
            /> */}
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
                />
              <XAxis
                dataKey="date"
                  fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                yAxisId="left"
                  fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                  domain={[0, 100]}
              />
                {hasPrice && (
              <YAxis
                yAxisId="right"
                    fontSize={12}
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
                )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
                <Bar
                  dataKey="fear"
                  name={t("fearGreedIndexLabel") ?? "Index"}
                yAxisId="left"
                  radius={[6, 6, 0, 0]}
                  barSize={16}
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.date}-${index}`}
                      fill={getColor(entry.classificationKey)}
                    />
                  ))}
                </Bar>
                {hasPrice && (
              <Line
                dataKey="price"
                    dot={false}
                    name={t("priceLabel") ?? "Price"}
                    stroke="#60a5fa"
                strokeWidth={2}
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
