"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FearGreedGaugeProps {
  value: number;
  lastUpdated: string;
}

export default function FearGreedGauge({ value, lastUpdated }: FearGreedGaugeProps) {
  const { t } = useLanguage();
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const from = 0;
    const to = value;

    function easeOutCubic(x: number): number {
      return 1 - Math.pow(1 - x, 3);
    }

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setAnimatedValue(Math.round(from + (to - from) * easedProgress));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [value]);

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

  const getSentimentGlow = (val: number): string => {
    if (val <= 25) return "rgba(239, 68, 68, 0.5)";
    if (val <= 45) return "rgba(249, 115, 22, 0.5)";
    if (val <= 55) return "rgba(234, 179, 8, 0.5)";
    if (val <= 75) return "rgba(132, 204, 22, 0.5)";
    return "rgba(34, 197, 94, 0.5)";
  };

  const angle = (animatedValue / 100) * 180 - 90;
  const sentimentColor = getSentimentColor(animatedValue);
  const sentimentGlow = getSentimentGlow(animatedValue);

  // Calculate needle tip position for the glow dot
  const needleLength = 130;
  const cx = 200;
  const cy = 240;
  const rad = (angle * Math.PI) / 180;
  const tipX = cx + needleLength * Math.sin(rad);
  const tipY = cy - needleLength * Math.cos(rad);

  // Generate tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tickValue = i * 10;
    const tickAngle = (tickValue / 100) * 180 - 90;
    const tickRad = (tickAngle * Math.PI) / 180;
    const innerR = 130;
    const outerR = tickValue % 50 === 0 ? 155 : 148;
    return {
      x1: cx + innerR * Math.sin(tickRad),
      y1: cy - innerR * Math.cos(tickRad),
      x2: cx + outerR * Math.sin(tickRad),
      y2: cy - outerR * Math.cos(tickRad),
      major: tickValue % 50 === 0,
    };
  });

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-10 text-center sm:gap-7 sm:px-6 sm:py-14">
      {/* Title Section */}
      <div className="w-full max-w-3xl space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {t("title")}
          </h1>
          <span className="relative flex h-2.5 w-2.5" title="Live data">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
        </div>
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {t("description")}
        </p>
      </div>

      {/* Gauge */}
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
            {/* Arc gradient follows the arc path */}
            <linearGradient id="gaugeGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="20%" stopColor="#f97316" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="60%" stopColor="#84cc16" />
              <stop offset="80%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>

            {/* Glow filter for needle tip */}
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Outer glow for the arc */}
            <filter id="arcGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <path
            d="M 50 240 A 150 150 0 0 1 350 240"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="28"
            strokeLinecap="round"
            opacity={0.3}
          />

          {/* Main gradient arc */}
          <path
            d="M 50 240 A 150 150 0 0 1 350 240"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="24"
            strokeLinecap="round"
            filter="url(#arcGlow)"
          />

          {/* Tick marks */}
          {ticks.map((tick, i) => (
            <line
              key={`tick-${i}`}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={tick.major ? 2.5 : 1.5}
              strokeLinecap="round"
              opacity={tick.major ? 0.7 : 0.35}
            />
          ))}

          {/* Needle shadow */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - needleLength}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="4"
            strokeLinecap="round"
            transform={`rotate(${angle}, ${cx}, ${cy}) translate(1, 1)`}
          />

          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - needleLength}
            stroke={sentimentColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            style={{
              transition: "none",
            }}
          />

          {/* Needle tip glow */}
          <circle
            cx={tipX}
            cy={tipY}
            r="8"
            fill={sentimentGlow}
            filter="url(#needleGlow)"
          />

          {/* Needle tip dot */}
          <circle
            cx={tipX}
            cy={tipY}
            r="5"
            fill={sentimentColor}
          />

          {/* Center hub outer ring */}
          <circle cx={cx} cy={cy} r="16" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          {/* Center hub inner */}
          <circle cx={cx} cy={cy} r="10" fill={sentimentColor} opacity={0.9} />
          <circle cx={cx} cy={cy} r="5" fill="hsl(var(--card))" />
        </svg>

        {/* Value overlay */}
        <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div
            className="font-display text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl"
            style={{ color: sentimentColor }}
            data-testid="text-gauge-value"
          >
            {animatedValue}
          </div>
          <div
            className="mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:text-sm"
            style={{
              color: sentimentColor,
              backgroundColor: `${sentimentColor}15`,
              border: `1px solid ${sentimentColor}30`,
            }}
            data-testid="text-sentiment-label"
          >
            {getSentimentLabel(animatedValue)}
          </div>
        </div>

        {/* Scale labels */}
        <div className="absolute -bottom-2 left-1 text-xs font-semibold tabular-nums text-muted-foreground sm:text-sm">
          0
        </div>
        <div className="absolute -bottom-2 right-1 text-xs font-semibold tabular-nums text-muted-foreground sm:text-sm">
          100
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 backdrop-blur">
        <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <p
          className="text-xs text-muted-foreground sm:text-sm"
          data-testid="text-last-updated"
        >
          {t("lastUpdated")}: {lastUpdated}
        </p>
      </div>
    </div>
  );
}
