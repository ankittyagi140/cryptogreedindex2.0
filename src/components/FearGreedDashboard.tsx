"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import FearGreedChart from "@/components/FearGreedChart";
import FearGreedGauge from "@/components/FearGreedGauge";
import MarketSentiment from "@/components/MarketSentiment";
import FearGreedDashboardSkeleton from "@/components/FearGreedDashboardSkeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  buildFearGreedFallbackData,
  buildFearGreedChartFallbackData,
  type CoinStatsFearGreedResponse,
  type CoinStatsFearGreedChartPoint,
} from "@/lib/coinstats";

type FearGreedApiResponse = CoinStatsFearGreedResponse & {
  source: "coinstats" | "fallback";
  meta?: {
    error?: string;
  };
};

type FearGreedChartApiResponse = {
  points: CoinStatsFearGreedChartPoint[];
  source: "coinstats" | "fallback";
  meta?: {
    error?: string;
  };
};

const CLASSIFICATION_KEY_MAP: Record<string, string> = {
  "extreme fear": "extremeFear",
  fear: "fear",
  neutral: "neutral",
  greed: "greed",
  "extreme greed": "extremeGreed",
};

function getClassificationKey(classification: string) {
  return CLASSIFICATION_KEY_MAP[classification.toLowerCase()];
}

function getClassificationLabel(
  t: ReturnType<typeof useLanguage>["t"],
  classification: string,
) {
  const key = getClassificationKey(classification);
  if (!key) {
    return classification;
  }
  return t(key);
}

function formatTimestamp(point: CoinStatsFearGreedResponse["now"]) {
  const iso = point.update_time;
  if (iso) {
    return new Date(iso).toLocaleString();
  }

  return new Date(point.timestamp * 1000).toLocaleString();
}

export default function FearGreedDashboard() {
  const { t } = useLanguage();
  const fallbackData = useMemo(() => buildFearGreedFallbackData(), []);
  const fallbackChart = useMemo(
    () => buildFearGreedChartFallbackData(),
    [],
  );

  const {
    data,
    isLoading,
    isError,
  } = useQuery<FearGreedApiResponse>({
    queryKey: ["fear-greed"],
    queryFn: async () => {
      const response = await fetch("/api/fear-and-greed", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json() as Promise<FearGreedApiResponse>;
    },
    staleTime: 600_000,
    refetchInterval: 600_000,
  });

  const {
    data: chartResponse,
    isLoading: isChartLoading,
    isError: isChartError,
  } = useQuery<FearGreedChartApiResponse>({
    queryKey: ["fear-greed-chart", { period: "1y" }],
    queryFn: async () => {
      const response = await fetch("/api/fear-and-greed-chart?period=1y", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json() as Promise<FearGreedChartApiResponse>;
    },
    staleTime: 600_000,
    refetchInterval: 600_000,
  });

  const safeData = data ?? fallbackData;
  const chartPoints =
    chartResponse?.points && chartResponse.points.length > 0
      ? chartResponse.points
      : isChartLoading
      ? []
      : fallbackChart;

  const sentimentData = [
    {
      label: t("now"),
      value: safeData.now.value,
      sentiment: getClassificationLabel(t, safeData.now.value_classification),
    },
    {
      label: t("yesterday"),
      value: safeData.yesterday.value,
      sentiment: getClassificationLabel(
        t,
        safeData.yesterday.value_classification,
      ),
    },
    {
      label: t("lastWeek"),
      value: safeData.lastWeek.value,
      sentiment: getClassificationLabel(
        t,
        safeData.lastWeek.value_classification,
      ),
    },
  ];

  const chartData = chartPoints.map((point) => ({
    date: new Date(point.timestamp * 1000).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    fear: point.value,
    price: point.price ?? undefined,
    classificationKey: point.value_classification
      ? getClassificationKey(point.value_classification) ?? undefined
      : undefined,
    classificationLabel:
      point.value_classification &&
      getClassificationLabel(t, point.value_classification),
  }));

  const showFallbackNotice =
    isError ||
    data?.source === "fallback" ||
    isChartError ||
    chartResponse?.source === "fallback" ||
    (!isChartLoading && chartData.length === 0);

  const showSkeleton = isLoading && !data;
  const showChartSkeleton = isChartLoading && chartPoints.length === 0;

  return (
    <main>
      {showSkeleton ? (
        <FearGreedDashboardSkeleton />
      ) : (
        <>
          <FearGreedGauge
            value={safeData.now.value}
            lastUpdated={formatTimestamp(safeData.now)}
          />
          <MarketSentiment data={sentimentData} />
          {showFallbackNotice && (
            <div className="mx-auto max-w-3xl rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {t("fallbackNotice") ??
                "Live fear and greed data is currently unavailable. Showing the most recent cached values."}
            </div>
          )}
          <FearGreedChart data={chartData} loading={showChartSkeleton} />
        </>
      )}
    </main>
  );
}

