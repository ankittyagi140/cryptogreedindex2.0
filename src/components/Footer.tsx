"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

type FooterLink = {
  labelKey: string;
  href: string;
  external?: boolean;
};

const productLinks: FooterLink[] = [
  { labelKey: "footerOverview", href: "/" },
  { labelKey: "footerCoins", href: "/coins" },
  { labelKey: "footerBtcDominance", href: "/btc-dominance" },
  { labelKey: "footerBtcRainbow", href: "/btc-rainbow" },
  { labelKey: "footerBlog", href: "/blog" },
];

const resourceLinks: FooterLink[] = [
  { labelKey: "footerSupport", href: "/contact" },
  { labelKey: "footerAbout", href: "/about" },
  { labelKey: "footerPrivacy", href: "/legal/privacy" },
  { labelKey: "footerTerms", href: "/legal/terms" },
  { labelKey: "footerDisclaimer", href: "/legal/disclaimer" },
];

const socialLinks = [
  {
    href: "https://www.linkedin.com/feed/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://x.com/AnkiTyagi007",
    label: "X (Twitter)",
    icon: Twitter,
  },
  {
    href: "https://www.instagram.com/crtptogreedindex/",
    label: "Instagram",
    icon: Instagram,
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <Image
                src="/cryptogreedindex-logo.png"
                alt="Crypto Greed Index logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-border/30 bg-background p-0.5 transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-display text-base font-bold tracking-tight">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Crypto
                </span>{" "}
                <span className="text-foreground">Greed Index</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground/80">
              {t("description")}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-background/50 text-muted-foreground transition-all duration-200 hover:border-border hover:bg-accent hover:text-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("footerProduct")}
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((item) => (
                <li key={item.labelKey}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resource Links */}
          <nav className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("footerResources")}
            </h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((item) => (
                <li key={item.labelKey}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-border/30 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="text-xs">
            &copy; {currentYear} Crypto Greed Index. {t("footerRights")}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
            <Link href="/legal/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <span className="text-border">|</span>
            <Link href="/legal/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <span className="text-border">|</span>
            <Link href="/legal/disclaimer" className="transition-colors hover:text-foreground">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
