"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Link2,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];

interface SocialShareMenuProps {
  title: string;
  description?: string;
  shareUrl?: string;
  buttonLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export default function SocialShareMenu({
  title,
  description,
  shareUrl,
  buttonLabel,
  variant = "outline",
  size = "sm",
  className,
}: SocialShareMenuProps) {
  const { t } = useLanguage();
  const [resolvedUrl, setResolvedUrl] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const computedButtonLabel = buttonLabel ?? t("share");

  useEffect(() => {
    if (shareUrl) {
      setResolvedUrl(shareUrl);
    } else if (typeof window !== "undefined") {
      setResolvedUrl(window.location.href);
    }
  }, [shareUrl]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (copyStatus === "copied") {
      const timeout = window.setTimeout(() => setCopyStatus("idle"), 2000);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [copyStatus]);

  const shareText = useMemo(() => description ?? title, [description, title]);

  const openShareWindow = (url: string) => {
    if (!resolvedUrl) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleTwitterShare = () => {
    if (!resolvedUrl) return;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(resolvedUrl)}`;
    openShareWindow(twitterUrl);
  };

  const handleLinkedInShare = () => {
    if (!resolvedUrl) return;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      resolvedUrl,
    )}`;
    openShareWindow(linkedInUrl);
  };

  const handleNativeShare = async () => {
    if (!resolvedUrl || !canNativeShare || !navigator.share) return;
    try {
      await navigator.share({
        title,
        text: shareText,
        url: resolvedUrl,
      });
    } catch (error) {
      console.error("Native share cancelled or failed", error);
    }
  };

  const handleCopyLink = async () => {
    if (!resolvedUrl) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(resolvedUrl);
        setCopyStatus("copied");
      } else {
        const input = document.createElement("input");
        input.value = resolvedUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopyStatus("copied");
      }
    } catch (error) {
      console.error("Failed to copy share link", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("inline-flex items-center gap-2", className)}
        >
          <Share2 className="h-4 w-4" />
          {computedButtonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {canNativeShare && (
          <>
            <DropdownMenuItem onSelect={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              {t("shareViaDevice")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onSelect={handleTwitterShare}>
          <Twitter className="mr-2 h-4 w-4" />
          {t("shareOnX")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLinkedInShare}>
          <Linkedin className="mr-2 h-4 w-4" />
          {t("shareOnLinkedIn")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleCopyLink}>
          <Link2 className="mr-2 h-4 w-4" />
          {copyStatus === "copied" ? t("linkCopied") : t("copyLink")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


