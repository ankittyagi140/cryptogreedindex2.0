import FearGreedDashboard from "@/components/FearGreedDashboard";
import TrendingCoinsTable from "@/components/TrendingCoinsTable";
import KnowledgeSections from "@/components/KnowledgeSections";
import AdSenseBanner from "@/components/AdSenseBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <FearGreedDashboard />
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
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

