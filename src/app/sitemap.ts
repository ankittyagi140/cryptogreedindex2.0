import type { MetadataRoute } from "next";
import { fetchCoinStatsMarket } from "@/lib/coinstats-market";

const baseUrl = "https://www.cryptogreedindex.com";

const staticRoutes = [
  "",
  "coins",
  "btc-dominance",
  "btc-rainbow",
  "about",
  "contact",
  "legal/privacy",
  "legal/terms",
  "legal/disclaimer",
];

async function getTopCoinIds() {
  try {
    const data = await fetchCoinStatsMarket<{ coins: { id: string }[] }>("/coins", {
      searchParams: { limit: 50, currency: "USD" },
    });
    return data.coins?.map(c => c.id) || [];
  } catch (e) {
    console.error("Failed to fetch coins for sitemap", e);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const topCoinIds = await getTopCoinIds();

  const staticSitemap = staticRoutes.map((path) => {
    const url = path ? `${baseUrl}/${path}` : baseUrl;
    return {
      url,
      lastModified,
      changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: path === "" ? 1 : path === "coins" ? 0.8 : 0.6,
    };
  });

  const coinSitemap: MetadataRoute.Sitemap = topCoinIds.map((id) => ({
    url: `${baseUrl}/coins/${id}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticSitemap, ...coinSitemap];
}
