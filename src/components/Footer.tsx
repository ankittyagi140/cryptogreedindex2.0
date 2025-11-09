"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Send,
  Twitter,
  ExternalLink,
  BookOpen,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

type FooterLink = {
  labelKey: string;
  href: string;
  external?: boolean;
};

const productLinks: FooterLink[] = [
  {
    labelKey: "footerOverview",
    href: "/",
  },
  {
    labelKey: "footerCoins",
    href: "/coins",
  },
  {
    labelKey: "footerBtcDominance",
    href: "/btc-dominance",
  },
  {
    labelKey: "footerBtcRainbow",
    href: "/btc-rainbow",
  },
  {
    labelKey: "footerBlog",
    href: "/blog",
  },
];

const resourceLinks: FooterLink[] = [
 
  {
    labelKey: "footerSupport",
    href: "/contact",
  },
  {
    labelKey: "footerAbout",
    href: "/about",
  },
  {
    labelKey: "footerPrivacy",
    href: "/legal/privacy",
  },
  {
    labelKey: "footerTerms",
    href: "/legal/terms",
  },
  {
    labelKey: "footerDisclaimer",
    href: "/legal/disclaimer",
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground">
              <Image
                src="/cryptogreedindex-logo.png"
                alt="Crypto Greed Index logo"
                width={42}
                height={42}
                className="h-9 w-9 rounded-full border border-border/40 bg-background p-0.5"
              />
              <span className="font-display text-lg font-semibold text-yellow-500">
                {t("title")}
              </span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("description")}
            </p>
            {/* <p className="text-sm text-muted-foreground">
              {t("footerAttribution")}{" "}
              <Link
                href="https://coinstats.app/api-docs/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              >
                CoinStats API
                <ExternalLink className="h-3 w-3" />
              </Link>
              .
            </p> */}
          </div>

          <nav className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("footerProduct")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((item) => (
                <li key={item.labelKey}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 hover:text-foreground"
                  >
                    <BookOpen className="h-4 w-4 text-muted-foreground/70" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("footerResources")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {resourceLinks.map((item) => (
                <li key={item.labelKey}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 hover:text-foreground"
                  >
                    <Send className="h-4 w-4 text-muted-foreground/70" />
                    {t(item.labelKey)}
                    {item.external && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground/70" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-6 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Crypto Greed Index. {t("footerRights")}
          </p>
          <div className="flex items-center gap-4 text-foreground">
            <Link
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://x.com/AnkiTyagi007"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="transition-colors hover:text-primary"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.instagram.com/crtptogreedindex/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

