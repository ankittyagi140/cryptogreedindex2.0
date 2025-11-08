import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Crypto Greed Index",
  description:
    "Discover the mission, features, and data sources that power CryptoGreedIndex.com.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
        About CryptoGreedIndex.com
      </h1>
      <section className="mt-6 space-y-4 text-muted-foreground">
        <p>
          CryptoGreedIndex is your comprehensive platform for tracking cryptocurrency
          market sentiment and price movements. We deliver real-time insights into the
          crypto market’s emotional state and highlight the most significant moves across
          major cryptocurrencies.
        </p>
        <p>
          Our mission is simple: provide accurate, real-time market sentiment analysis
          and price movement tracking so investors can make informed decisions. Every
          feature on this site is built to surface the market’s mood in an intuitive,
          actionable way.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Key Features
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            <strong>Fear &amp; Greed Index:</strong> Track the market’s emotional state
            with daily updates.
          </li>
          <li>
            <strong>Top Gainers:</strong> Monitor the cryptocurrencies posting the
            strongest gains.
          </li>
          <li>
            <strong>Top Losers:</strong> Stay aware of sharp declines to identify
            downtrends.
          </li>
          <li>
            <strong>Market Dominance:</strong> Follow dominance percentages for Bitcoin,
            Ethereum, and the wider altcoin market.
          </li>
          <li>
            <strong>Global Markets:</strong> Review total market cap, 24h volume, and
            trends across different regions.
          </li>
          <li>
            <strong>US Markets:</strong> Keep tabs on US-specific trading activity,
            sentiment, and regulatory developments.
          </li>
          <li>
            <strong>Social Sharing:</strong> Share insights instantly through channels
            like Twitter, Facebook, Telegram, and WhatsApp.
          </li>
          <li>
            <strong>Real-time Updates:</strong> Data refreshes frequently so you never
            miss a market shift.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Data Sources
        </h2>
        <p className="text-muted-foreground">
          We rely on trusted providers to ensure data accuracy:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>CoinStats API for market data, prices, and market cap metrics.</li>
          <li>Alternative.me API for Fear &amp; Greed Index sentiment readings.</li>
          <li>Real-time market data aggregated from multiple exchanges.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Market Overview
        </h2>
        <p className="text-muted-foreground">
          CryptoGreedIndex delivers a holistic market snapshot, including:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Total market capitalization and 24h volume metrics.</li>
          <li>Bitcoin and Ethereum dominance trends plus altcoin market share.</li>
          <li>Historical Fear &amp; Greed Index movements and sentiment shifts.</li>
          <li>Major price movers across leading cryptocurrencies.</li>
          <li>Regional highlights for both US and global markets.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Contact Us
        </h2>
        <p className="text-muted-foreground">
          Questions or feedback? We’d love to hear from you:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            Email:{" "}
            <a
              href="mailto:cryptogreedindex@gmail.com"
              className="text-primary underline-offset-4 hover:underline"
            >
              cryptogreedindex@gmail.com
            </a>
          </li>
          <li>
            Website:{" "}
            <a
              href="https://www.cryptogreedindex.com/contact"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              cryptogreedindex.com/contact
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

