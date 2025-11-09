'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';

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
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);
  const {
    minHeight: providedMinHeight,
    maxHeight: providedMaxHeight,
    ...styleRest
  } = style ?? {};

  const defaultMinHeight = "clamp(48px, 22vw, 120px)";
  const computedMinHeight = providedMinHeight ?? defaultMinHeight;
  const sharedStyle: CSSProperties = {
    ...styleRest,
    minHeight: computedMinHeight,
  };
  if (providedMaxHeight) {
    sharedStyle.maxHeight = providedMaxHeight;
  }

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    let isCancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let pollingInterval: ReturnType<typeof setInterval> | null = null;

    const hidePlaceholder = () => {
      if (!isCancelled) {
        setPlaceholderVisible((prev) => (prev ? false : prev));
      }
    };

    const showPlaceholder = () => {
      if (!isCancelled) {
        setPlaceholderVisible(true);
      }
    };

    const initializeAdSense = () => {
      if (initialized.current) return;

      if (typeof window !== "undefined" && !window.adSenseInitialized) {
        window.adSenseInitialized = new Set();
      }

      if (typeof window !== "undefined" && window.adSenseInitialized?.has(adSlot)) {
        initialized.current = true;
        hidePlaceholder();
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
            hidePlaceholder();
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
            hidePlaceholder();
          }, 2_000);
        } catch (error) {
          console.error("AdSenseBanner: initialization error", error);
          initialized.current = false;
          showPlaceholder();
        }
      } else {
        retryTimer = setTimeout(() => {
          showPlaceholder();
          if (!pollingInterval) {
            pollingInterval = setInterval(() => {
              if (!initialized.current) {
                initializeAdSense();
              } else if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
              }
            }, 2_000);
          }
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
      isCancelled = true;
      initialized.current = false;
      if (resizeObserver) resizeObserver.disconnect();
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [adSlot]);

  return (
    <div
      className={`relative ${className}`}
      ref={adRef}
      style={{
        minWidth: "50px",
        width: "100%",
        ...sharedStyle,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minWidth: "50px",
          width: "100%",
          ...sharedStyle,
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />

      <div
        className="absolute inset-0 flex items-center justify-center rounded-xl border border-blue-200/40 bg-gradient-to-r from-blue-50 to-indigo-50 text-xs text-blue-500 transition-opacity duration-300"
        style={{
          opacity: isPlaceholderVisible ? 1 : 0,
          minWidth: "50px",
          minHeight: computedMinHeight,
          pointerEvents: "none",
          visibility: isPlaceholderVisible ? "visible" : "hidden",
          ...(providedMaxHeight ? { maxHeight: providedMaxHeight } : {}),
        }}
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
