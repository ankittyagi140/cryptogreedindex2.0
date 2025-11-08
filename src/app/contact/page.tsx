import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Crypto Greed Index",
  description:
    "Get in touch with the Crypto Greed Index team for support, partnerships, or media inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 lg:flex-row">
        <div className="flex-1 rounded-3xl border border-border/60 bg-background/80 p-8 shadow-sm">
          <h1 className="font-display text-4xl font-bold text-foreground">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Have questions about our Fear &amp; Greed tools? We&apos;re here to help.
            Reach out and we&apos;ll respond as soon as we can.
          </p>

          <div className="mt-8 space-y-6 text-sm text-muted-foreground">
            <div>
              <h2 className="text-base font-semibold text-foreground">Email</h2>
              <p className="mt-1">
                <Link
                  href="mailto:cryptogreedindex@gmail.com"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  cryptogreedindex@gmail.com
                </Link>
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Response Time</h2>
              <p className="mt-1">
                We typically respond within 24–48 hours during business days.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Community</h2>
              <p className="mt-1">
                Stay updated on{" "}
                <Link
                  href="https://twitter.com/coinstats"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  X (Twitter)
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-3xl border border-border/60 bg-background/80 p-8 shadow-sm">
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="How can we help?"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Share a brief summary of what you need help with."
                className="mt-1 h-40 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

