"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface FearGreedGaugeProps {
  value: number;
  lastUpdated: string;
}

export default function FearGreedGauge({ value, lastUpdated }: FearGreedGaugeProps) {
  const { t } = useLanguage();

  const getSentimentLabel = (val: number): string => {
    if (val <= 25) return t('extremeFear');
    if (val <= 45) return t('fear');
    if (val <= 55) return t('neutral');
    if (val <= 75) return t('greed');
    return t('extremeGreed');
  };

  const getSentimentColor = (val: number): string => {
    if (val <= 25) return '#ef4444';
    if (val <= 45) return '#f97316';
    if (val <= 55) return '#eab308';
    if (val <= 75) return '#84cc16';
    return '#22c55e';
  };

  const angle = (value / 100) * 240 - 120;

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t('description')}</p>
      </div>

      <div className="relative">
        <svg width="400" height="280" viewBox="0 0 400 280" className="overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
              <stop offset="25%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
              <stop offset="75%" style={{ stopColor: '#84cc16', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
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
            stroke={getSentimentColor(value)}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle}, 200, 240)`}
          />
          <circle cx="200" cy="240" r="12" fill={getSentimentColor(value)} />
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-8">
          <div className="font-display text-7xl font-bold tabular-nums" data-testid="text-gauge-value">
            {value}
          </div>
          <div className="font-display text-2xl font-semibold mt-2" style={{ color: getSentimentColor(value) }} data-testid="text-sentiment-label">
            {getSentimentLabel(value)}
          </div>
        </div>

        <div className="absolute -bottom-4 left-0 text-sm text-muted-foreground">0</div>
        <div className="absolute -bottom-4 right-0 text-sm text-muted-foreground">100</div>
      </div>

      <p className="text-sm text-muted-foreground" data-testid="text-last-updated">
        {t('lastUpdated')}: {lastUpdated}
      </p>
    </div>
  );
}
