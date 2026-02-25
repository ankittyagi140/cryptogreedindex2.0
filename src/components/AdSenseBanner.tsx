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

    const initializeAdSense = () => {
      if (initialized.current || isCancelled) return;

      if (typeof window !== "undefined" && !window.adSenseInitialized) {
        window.adSenseInitialized = new Set();
      }

      if (typeof window !== "undefined" && window.adSenseInitialized?.has(adSlot)) {
        initialized.current = true;
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
            return;
          }
        }

        try {
          initialized.current = true;
          if (typeof window !== "undefined" && window.adSenseInitialized) {
            window.adSenseInitialized.add(adSlot);
          }
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error("AdSenseBanner: initialization error", error);
          initialized.current = false;
        }
      } else {
        retryTimer = setTimeout(() => {
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
    </div>
  );
}
