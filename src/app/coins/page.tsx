import type { Metadata } from "next";

import CoinsPageContent from "@/components/CoinsPageContent";

export const metadata: Metadata = {
  title: "Today's Crypto Prices by Market Cap",
  description:
    "Explore the top cryptocurrencies by market capitalisation with live prices, 24h performance, and sparkline charts powered by the CoinStats API.",
};

export default function CoinsPage() {
  return <CoinsPageContent />;
}

