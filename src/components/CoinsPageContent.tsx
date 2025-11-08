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
        <div className="w-full px-6 pt-16 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            {t("coinsPageTitle")}
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            {t("coinsPageSubtitle")}
          </p>
          <MarketOverview />
        </div>
      </div>

      <TrendingCoinsTable
        perPage={perPage}
        showSeeMore={false}
        enablePagination
        containerClassName="w-full px-6 py-16 lg:py-20"
        title={t("topCoinsTitle")}
        subtitle={t("topCoinsSubtitle")}
      />
    </div>
  );
}


