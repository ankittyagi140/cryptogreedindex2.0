"use client";

import MarketOverview from "@/components/MarketOverview";
import TrendingCoinsTable from "@/components/TrendingCoinsTable";
import { useLanguage } from "@/contexts/LanguageContext";

interface CoinsPageContentProps {
  perPage?: number;
}

export default function CoinsPageContent({ perPage = 40 }: CoinsPageContentProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-background via-background/90 to-background">
        <div className="w-full px-4 pt-10 text-center sm:px-6 sm:pt-14">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("coinsPageTitle")}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            {t("coinsPageSubtitle")}
          </p>
          <MarketOverview />
        </div>
      </div>

      <TrendingCoinsTable
        perPage={perPage}
        showSeeMore={false}
        enablePagination
        containerClassName="w-full px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
        title={t("topCoinsTitle")}
        subtitle={t("topCoinsSubtitle")}
      />
    </div>
  );
}


