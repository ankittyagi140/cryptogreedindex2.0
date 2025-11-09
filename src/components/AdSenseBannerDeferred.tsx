"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const LazyAdSenseBanner = dynamic(() => import("@/components/AdSenseBanner"), {
  ssr: false,
  loading: () => null,
});

export default function AdSenseBannerDeferred(
  props: ComponentProps<typeof LazyAdSenseBanner>,
) {
  return <LazyAdSenseBanner {...props} />;
}
