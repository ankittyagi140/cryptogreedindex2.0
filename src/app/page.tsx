import FearGreedDashboard from "@/components/FearGreedDashboard";
import TrendingCoinsTable from "@/components/TrendingCoinsTable";
import KnowledgeSections from "@/components/KnowledgeSections";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <FearGreedDashboard />
      <TrendingCoinsTable />
      <KnowledgeSections />
    </div>
  );
}

