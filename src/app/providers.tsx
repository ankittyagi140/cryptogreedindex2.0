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

