"use client";

import Image from "next/image";
import Link from "next/link";
import { House, Coins, Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const navLinks = [
  { href: "/", labelKey: "navHome", icon: House },
  { href: "/coins", labelKey: "navCoins", icon: Coins },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cryptogreedindex_logo.png"
            alt="Crypto Fear & Greed Index logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-full border border-border/40 bg-background p-0.5"
          />
          <span className="font-display text-xl font-bold text-foreground">
            Crypto Greed Index
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
            {navLinks.map(({ href, labelKey, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 transition-colors hover:border-border hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {t(labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-language">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-accent" : ""}
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
