'use client';

import { CSSProperties, useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  adSlot: string;
  adClient: string;
  adFormat?: string;
  className?: string;
  style?: CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    adSenseInitialized?: Set<string>;
  }
}

export default function AdSenseBanner({
  adSlot,
  adClient,
  adFormat = "auto",
  className = "",
  style = {},
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    const initializeAdSense = () => {
      if (initialized.current) return;

      if (typeof window !== "undefined" && !window.adSenseInitialized) {
        window.adSenseInitialized = new Set();
      }

      if (typeof window !== "undefined" && window.adSenseInitialized?.has(adSlot)) {
        initialized.current = true;
        const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
        if (placeholder) placeholder.style.opacity = "0";
        return;
      }

      if (adRef.current) {
        const rect = adRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(adRef.current);

        if (rect.width < 50 || rect.height === 0) {
          setTimeout(initializeAdSense, 1000);
          return;
        }

        if (
          computedStyle.display === "none" ||
          computedStyle.visibility === "hidden" ||
          computedStyle.opacity === "0"
        ) {
          setTimeout(initializeAdSense, 1000);
          return;
        }
      }

      if (typeof window !== "undefined" && window.adsbygoogle) {
        const insElement = adRef.current?.querySelector<HTMLDivElement>(".adsbygoogle");
        if (insElement) {
          const alreadyLoaded =
            insElement.children.length > 0 ||
            insElement.innerHTML.trim() !== "" ||
            insElement.getAttribute("data-adsbygoogle-status") === "done";

          if (alreadyLoaded) {
            initialized.current = true;
            const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
            if (placeholder) placeholder.style.opacity = "0";
            return;
          }
        }

        try {
          initialized.current = true;
          if (typeof window !== "undefined" && window.adSenseInitialized) {
            window.adSenseInitialized.add(adSlot);
          }
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setTimeout(() => {
            const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
            if (placeholder) placeholder.style.opacity = "0";
          }, 2_000);
        } catch (error) {
          console.error("AdSenseBanner: initialization error", error);
          initialized.current = false;
          const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
          if (placeholder) placeholder.style.opacity = "1";
        }
      } else {
        setTimeout(() => {
          const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
          if (placeholder) placeholder.style.opacity = "1";
        }, 1_500);
      }
    };

    const attemptInitialization = () => {
      const check = () => {
        if (adRef.current) {
          const rect = adRef.current.getBoundingClientRect();
          if (rect.width >= 50 && rect.height > 0) {
            initializeAdSense();
            return true;
          }
        }
        return false;
      };

      if (!check()) {
        setTimeout(() => {
          if (!check()) {
            setTimeout(() => {
              if (!check()) {
                setTimeout(initializeAdSense, 3_000);
              }
            }, 1_500);
          }
        }, 800);
      }
    };

    attemptInitialization();

    if (adRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (!initialized.current) {
          setTimeout(initializeAdSense, 200);
        }
      });
      resizeObserver.observe(adRef.current);
    }

    return () => {
      initialized.current = false;
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [adSlot]);

  return (
    <div
      className={`relative ${className}`}
      ref={adRef}
      style={{ minWidth: "50px", minHeight: "60px", width: "100%", ...style }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "60px",
          minWidth: "50px",
          width: "100%",
          ...style,
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />

      <div
        className="absolute inset-0 flex items-center justify-center rounded-xl border border-blue-200/40 bg-gradient-to-r from-blue-50 to-indigo-50 text-xs text-blue-500 transition-opacity duration-300"
        id={`ad-placeholder-${adSlot}`}
        style={{ opacity: 1, minWidth: "50px", minHeight: "60px" }}
      >
        <div className="text-center">
          <div className="text-sm font-semibold">Advertisement</div>
          <div className="mt-1 text-[10px] text-blue-400">Slot: {adSlot}</div>
          <div className="text-[10px] text-blue-400">Loading…</div>
        </div>
      </div>
    </div>
  );
}
