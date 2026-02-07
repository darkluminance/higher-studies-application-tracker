"use client";

import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/api/swr-config";
import { authFetcher } from "@/lib/api/fetcher";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ ...swrConfig, fetcher: authFetcher }}>
      {children}
    </SWRConfig>
  );
}
