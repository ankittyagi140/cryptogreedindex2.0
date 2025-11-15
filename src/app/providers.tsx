"use client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { queryCachePersister, QUERY_CACHE_MAX_AGE } from "@/lib/queryPersister";
import { queryClient } from "@/lib/queryClient";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryCachePersister,
        maxAge: QUERY_CACHE_MAX_AGE,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Exclude fear and greed queries from persistence to prevent stale values
            const queryKey = query.queryKey[0];
            if (
              queryKey === "fear-greed" ||
              queryKey === "fear-greed-chart"
            ) {
              return false;
            }
            return true;
          },
        },
      }}
    >
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

