"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Coins,
  Moon,
  Sun,
  Globe,
  Menu,
  ChevronDown,
  TrendingUp,
  BarChart3,
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
  { code: "en" as Language, name: "English", flag: "EN" },
  { code: "es" as Language, name: "Español", flag: "ES" },
  { code: "pt" as Language, name: "Português", flag: "PT" },
  { code: "ja" as Language, name: "日本語", flag: "JA" },
  { code: "ko" as Language, name: "한국어", flag: "KO" },
  { code: "hi" as Language, name: "हिन्दी", flag: "HI" },
  { code: "de" as Language, name: "Deutsch", flag: "DE" },
  { code: "fr" as Language, name: "Français", flag: "FR" },
  { code: "zh" as Language, name: "中文", flag: "ZH" },
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
  { href: "/btc-dominance", labelKey: "navBtcDominance", icon: BarChart3 },
  { href: "/btc-rainbow", labelKey: "navRainbow", icon: TrendingUp },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/cryptogreedindex-logo.png"
            alt="Crypto Fear & Greed Index logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-full border border-border/30 bg-background p-0.5 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="hidden font-display text-base font-bold tracking-tight text-foreground sm:inline-block">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Crypto
            </span>{" "}
            <span className="text-foreground">Greed Index</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, labelKey, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {navLabels[labelKey]?.[language] ?? navLabels[labelKey]?.en ?? labelKey}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown — Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-1.5 rounded-lg px-2.5 text-muted-foreground hover:text-foreground md:inline-flex"
                data-testid="button-language"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">
                  {languages.find((l) => l.code === language)?.flag}
                </span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`gap-3 ${language === lang.code
                    ? "bg-accent font-medium text-foreground"
                    : ""
                    }`}
                  data-testid={`button-language-${lang.code}`}
                >
                  <span className="inline-flex h-5 w-7 items-center justify-center rounded bg-muted text-[10px] font-bold uppercase">
                    {lang.flag}
                  </span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle — Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="hidden h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground md:inline-flex"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg md:hidden"
                aria-label="Open navigation"
                data-testid="button-mobile-nav"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs border-border/40 bg-background px-0 pb-8 pt-6"
            >
              <SheetHeader className="px-6">
                <SheetTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("navMenu") ?? "Navigation"}
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Logo */}
              <div className="mt-4 px-6">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/cryptogreedindex-logo.png"
                    alt="Crypto Fear & Greed Index logo"
                    width={48}
                    height={48}
                    className="h-11 w-11 rounded-full border border-border/30 bg-background p-0.5"
                  />
                  <span className="font-display text-lg font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                      Crypto
                    </span>{" "}
                    <span className="text-foreground">Greed Index</span>
                  </span>
                </Link>
              </div>

              {/* Mobile Nav Links */}
              <nav className="mt-8 flex flex-col gap-1 px-3">
                {navLinks.map(({ href, labelKey, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-accent hover:text-foreground"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        {navLabels[labelKey]?.[language] ?? navLabels[labelKey]?.en ?? labelKey}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

              {/* Mobile Preferences */}
              <div className="mt-10 border-t border-border/40 px-6 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {t("navSettings") ?? "Preferences"}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-lg"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase">
                          {languages.find((l) => l.code === language)?.flag}
                        </span>
                        <span className="font-medium">
                          {languages.find((l) => l.code === language)?.name}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[160px]">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`gap-3 ${language === lang.code ? "bg-accent font-medium" : ""
                            }`}
                          data-testid={`button-language-${lang.code}`}
                        >
                          <span className="inline-flex h-5 w-7 items-center justify-center rounded bg-muted text-[10px] font-bold uppercase">
                            {lang.flag}
                          </span>
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
                    className="gap-2 rounded-lg"
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
        </div>
      </div>
    </header>
  );
}
