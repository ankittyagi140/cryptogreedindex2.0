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
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <Card className="p-5 sm:p-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {t("marketSentiment")}
          </h2>
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
              <div
                className={`text-2xl font-bold tabular-nums sm:text-3xl ${getSentimentColor(
                  item.value,
                )}`}
                data-testid={`text-value-${index}`}
              >
                {item.value} {item.sentiment}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
