"use client";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SentimentData {
  label: string;
  value: number;
  sentiment: string;
}

interface MarketSentimentProps {
  data: SentimentData[];
}

const getSentimentColor = (val: number): string => {
  if (val <= 25) return "#ef4444";
  if (val <= 45) return "#f97316";
  if (val <= 55) return "#eab308";
  if (val <= 75) return "#84cc16";
  return "#22c55e";
};



export default function MarketSentiment({ data }: MarketSentimentProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {t("marketSentiment")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {data.map((item, index) => {
          const color = getSentimentColor(item.value);
          return (
            <Card
              key={index}
              className="group relative overflow-hidden border-border/40 bg-card/80 p-5 backdrop-blur transition-all duration-300 hover:border-border hover:shadow-lg"
              data-testid={`card-sentiment-${index}`}
              style={{
                borderTop: `3px solid ${color}`,
              }}
            >
              {/* Subtle gradient background glow */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.15]"
                style={{ backgroundColor: color }}
              />

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {item.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span
                      className="font-display text-2xl font-extrabold tabular-nums sm:text-3xl"
                      style={{ color }}
                      data-testid={`text-value-${index}`}
                    >
                      {item.value}
                    </span>
                  </div>
                  <p
                    className="mt-0.5 text-xs font-bold uppercase tracking-wide"
                    style={{ color }}
                  >
                    {item.sentiment}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}60`,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] font-medium text-muted-foreground/60">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
