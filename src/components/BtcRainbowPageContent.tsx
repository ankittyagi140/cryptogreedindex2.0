"use client";

import RainbowChart from "@/components/RainbowChart";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

const titles: Record<Language, string> = {
  en: "Bitcoin Rainbow Chart",
  es: "Gráfico Rainbow de Bitcoin",
  pt: "Gráfico Rainbow do Bitcoin",
  ja: "ビットコイン レインボーチャート",
  ko: "비트코인 레인보우 차트",
  hi: "बिटकॉइन रेनबो चार्ट",
  de: "Bitcoin Rainbow Chart",
  fr: "Graphique arc-en-ciel Bitcoin",
  zh: "比特币彩虹图",
};

const subtitles: Record<Language, string> = {
  en: "Visualise Bitcoin's historical price in context with sentiment bands.",
  es: "Visualiza el precio histórico de Bitcoin con bandas de sentimiento.",
  pt: "Visualize o preço histórico do Bitcoin com faixas de sentimento.",
  ja: "感情帯を重ねてビットコインの価格推移を可視化します。",
  ko: "심리 밴드와 함께 비트코인의 가격 역사를 시각화하세요.",
  hi: "भावनात्मक बैंड के साथ बिटकॉइन का इतिहास देखें।",
  de: "Visualisiere den historischen Bitcoin-Preis mit Sentiment-Bändern.",
  fr: "Visualisez l'historique du prix du Bitcoin avec des bandes de sentiment.",
  zh: "通过情绪带可视化比特币历史价格。",
};

export default function BtcRainbowPageContent() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-background via-background/95 to-background">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16 md:max-w-5xl lg:max-w-6xl">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              {titles[language] ?? titles.en}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {subtitles[language] ?? subtitles.en}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <RainbowChart />
      </div>
    </div>
  );
}

