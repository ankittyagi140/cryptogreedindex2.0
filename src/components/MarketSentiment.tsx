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

export default function MarketSentiment({ data }: MarketSentimentProps) {
  const { t } = useLanguage();

  const getSentimentColor = (val: number): string => {
    if (val <= 25) return "text-red-500";
    if (val <= 45) return "text-orange-500";
    if (val <= 55) return "text-yellow-500";
    if (val <= 75) return "text-lime-500";
    return "text-green-500";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <Card className="p-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="font-display text-3xl font-semibold">{t("marketSentiment")}</h2>
          {/* <SocialShareMenu
            title={t("marketSentiment")}
            description={t("description")}
            variant="outline"
            size="sm"
          /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <div key={index} className="space-y-2" data-testid={`card-sentiment-${index}`}>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">{item.label}</p>
              <div className={`text-3xl font-bold tabular-nums ${getSentimentColor(item.value)}`} data-testid={`text-value-${index}`}>
                {item.value} {item.sentiment}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
