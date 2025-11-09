"use client";

import Image from "next/image";
import Link from "next/link";
import {
  House,
  Coins,
  Moon,
  Sun,
  Globe,
  Menu,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "pt" as Language, name: "Português", flag: "🇧🇷" },
  { code: "ja" as Language, name: "日本語", flag: "🇯🇵" },
  { code: "ko" as Language, name: "한국어", flag: "🇰🇷" },
  { code: "hi" as Language, name: "हिन्दी", flag: "🇮🇳" },
  { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
];

const navLabels: Record<string, Record<Language, string>> = {
  navHome: {
    en: "Home",
    es: "Inicio",
    pt: "Início",
    ja: "ホーム",
    ko: "홈",
    hi: "होम",
    de: "Start",
    fr: "Accueil",
    zh: "首页",
  },
  navCoins: {
    en: "Cryptocurrencies",
    es: "Criptomonedas",
    pt: "Criptomoedas",
    ja: "暗号資産一覧",
    ko: "암호화폐",
    hi: "क्रिप्टोकरेंसी",
    de: "Kryptowährungen",
    fr: "Cryptomonnaies",
    zh: "加密货币",
  },
  navBtcDominance: {
    en: "BTC Dominance",
    es: "Dominancia BTC",
    pt: "Dominância BTC",
    ja: "BTC ドミナンス",
    ko: "BTC 도미넌스",
    hi: "BTC प्रभुत्व",
    de: "BTC-Dominanz",
    fr: "Dominance BTC",
    zh: "BTC 主导率",
  },
  navRainbow: {
    en: "BTC Rainbow",
    es: "BTC Rainbow",
    pt: "BTC Rainbow",
    ja: "BTC レインボー",
    ko: "BTC 레인보우",
    hi: "BTC रेनबो",
    de: "BTC Rainbow",
    fr: "BTC Rainbow",
    zh: "BTC 彩虹图",
  },
};

const navLinks = [
  { href: "/", labelKey: "navHome", icon: House },
  { href: "/coins", labelKey: "navCoins", icon: Coins },
  { href: "/btc-dominance", labelKey: "navBtcDominance", icon: TrendingUp },
  { href: "/btc-rainbow", labelKey: "navRainbow", icon: TrendingUp },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cryptogreedindex-logo.png"
            alt="Crypto Fear & Greed Index logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-full border border-border/40 bg-background p-0.5"
          />
          <span className="font-display text-xl font-bold text-yellow-400">
            Crypto Greed Index
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation"
                data-testid="button-mobile-nav"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs border-border/50 bg-background/95 px-0 pb-8 pt-6"
            >
              <SheetHeader className="px-6">
                <SheetTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {t("navMenu") ?? "Navigation"}
                </SheetTitle>
              </SheetHeader>
              <div className="px-6">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/cryptogreedindex-logo.png"
                    alt="Crypto Fear & Greed Index logo"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border border-border/40 bg-background p-0.5"
                  />
                  <span className="font-display text-lg font-semibold text-yellow-400">
                    Crypto Greed Index
                  </span>
                </Link>
              </div>
              <nav className="mt-8 flex flex-col gap-2 px-2">
                {navLinks.map(({ href, labelKey, icon: Icon }) => (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 rounded-md px-4 py-3 text-base font-medium text-foreground/90 transition hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      {navLabels[labelKey]?.[language] ?? navLabels[labelKey]?.en ?? labelKey}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-10 border-t border-border/60 px-6 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  {t("navSettings") ?? "Preferences"}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="flex items-center gap-2">
                          <span>
                            {languages.find((l) => l.code === language)?.flag}
                          </span>
                          <span className="font-medium">
                            {languages.find((l) => l.code === language)?.name}
                          </span>
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={
                            language === lang.code ? "bg-accent font-medium" : ""
                          }
                          data-testid={`button-language-${lang.code}`}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    data-testid="button-theme-toggle-mobile"
                    className="gap-2"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4" />
                        <span>{t("themeLight") ?? "Light"}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        <span>{t("themeDark") ?? "Dark"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
            {navLinks.map(({ href, labelKey, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-border hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {navLabels[labelKey]?.[language] ?? navLabels[labelKey]?.en ?? labelKey}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full px-3"
                data-testid="button-language"
              >
                <Globe className="h-5 w-5" />
                <span className="flex items-center gap-2">
                  <span>{languages.find((l) => l.code === language)?.flag}</span>
                  <span className="hidden lg:inline font-medium">
                    {languages.find((l) => l.code === language)?.name}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-accent font-medium" : ""}
                  data-testid={`button-language-${lang.code}`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        </div>
      </div>
    </header>
  );
}
