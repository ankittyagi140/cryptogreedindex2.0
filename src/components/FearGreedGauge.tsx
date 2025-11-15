"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { CSSProperties } from "react";
import AdSenseBanner from "./AdSenseBanner";

interface FearGreedGaugeProps {
  value: number;
  lastUpdated: string;
}

export default function FearGreedGauge({ value, lastUpdated }: FearGreedGaugeProps) {
  const { t } = useLanguage();

  const getSentimentLabel = (val: number): string => {
    if (val <= 25) return t("extremeFear");
    if (val <= 45) return t("fear");
    if (val <= 55) return t("neutral");
    if (val <= 75) return t("greed");
    return t("extremeGreed");
  };

  const getSentimentColor = (val: number): string => {
    if (val <= 25) return "#ef4444";
    if (val <= 45) return "#f97316";
    if (val <= 55) return "#eab308";
    if (val <= 75) return "#84cc16";
    return "#22c55e";
  };

  const angle = (value / 100) * 240 - 120;

  const adStyle: CSSProperties = {
    minHeight: "clamp(36px, 18vw, 120px)",
    maxHeight: "140px",
  };

  const topAdProps = {
    adSlot: "5441357265",
    adClient: "ca-pub-1332831285527693",
    adFormat: "auto" as const,
    className: "w-full",
    style: adStyle,
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-12 text-center sm:gap-8 sm:px-6 sm:py-16">
      <div className="w-full max-w-3xl">
        <h1 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t("description")}
        </p>
      </div>
   <div className="w-full bg-background/95">
              <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:py-4">
                <AdSenseBanner {...topAdProps} />
              </div>
            </div>
      <div
        className="relative w-full max-w-[340px] sm:max-w-[420px]"
        style={{ aspectRatio: "400 / 280" }}
      >
        <svg
          viewBox="0 0 400 280"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
              <stop offset="25%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#eab308", stopOpacity: 1 }} />
              <stop offset="75%" style={{ stopColor: "#84cc16", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#22c55e", stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          <path
            d="M 50 240 A 150 150 0 0 1 350 240"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          <circle cx="50" cy="240" r="6" fill={getSentimentColor(value)} />

          <line
            x1="200"
            y1="240"
            x2="200"
            y2="100"
            stroke="#1e3a8a"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle}, 200, 240)`}
          />
          <circle cx="200" cy="240" r="12" fill="#1e3a8a" />
        </svg>

        <div className="absolute left-1/2 top-1/2 mt-6 -translate-x-1/2 -translate-y-1/2 text-center sm:mt-8">
          <div
            className="font-display text-5xl font-bold tabular-nums sm:text-7xl"
            data-testid="text-gauge-value"
          >
            {value}
          </div>
          <div
            className="mt-2 font-display text-xl font-semibold sm:text-2xl"
            style={{ color: getSentimentColor(value) }}
            data-testid="text-sentiment-label"
          >
            {getSentimentLabel(value)}
          </div>
        </div>

        <div className="absolute -bottom-4 left-0 text-sm text-muted-foreground">0</div>
        <div className="absolute -bottom-4 right-0 text-sm text-muted-foreground">100</div>
      </div>

      <p
        className="text-xs text-muted-foreground sm:text-sm"
        data-testid="text-last-updated"
      >
        {t("lastUpdated")}: {lastUpdated}
      </p>
    </div>
  );
}
