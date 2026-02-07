// SWR Configuration

import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  keepPreviousData: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
};
