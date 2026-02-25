import type { Metadata } from "next";
import FearGreedDashboard from "@/components/FearGreedDashboard";
import TrendingCoinsTable from "@/components/TrendingCoinsTable";
import KnowledgeSections from "@/components/KnowledgeSections";
import AdSenseBanner from "@/components/AdSenseBanner";

export const metadata: Metadata = {
  title: "Crypto Fear and Greed Index – Live Market Sentiment Dashboard",
  description: "Get the latest Crypto Fear and Greed Index score. Analyzes live crypto market sentiment, bitcoin dominance, and price trends for smart investing.",
  alternates: {
    canonical: "https://www.cryptogreedindex.com",
  },
  openGraph: {
    title: "Crypto Fear and Greed Index – Live Market Sentiment Dashboard",
    description: "Track the emotional state of the crypto market in real-time. Live fear and greed scores, bitcoin dominance, and top gainers.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <FearGreedDashboard />
      <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">
        <AdSenseBanner
          adSlot="9708814146"
          adClient="ca-pub-1332831285527693"
          adFormat="auto"
          className="w-full"
          style={{ minHeight: "50px", maxHeight: "160px" }}
        />
      </div>
      <TrendingCoinsTable />
      <KnowledgeSections />
    </div>
  );
}
