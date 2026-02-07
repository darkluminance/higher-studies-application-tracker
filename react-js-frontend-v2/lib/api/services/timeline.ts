// Timeline API Service

import useSWR from "swr";
import { API_ENDPOINTS } from "@/lib/constants";
import type { DashboardData } from "@/lib/types";

export function useTimeline() {
  const { data, error, isLoading, isValidating } = useSWR<DashboardData>(
    API_ENDPOINTS.TIMELINE
  );

  return {
    timeline: data?.Timeline ?? [],
    stats: {
      appliedCount: data?.Applieduniversitycount ?? 0,
      repliedMailsCount: data?.Repliedmailscount ?? 0,
      applicationCount: data?.Universityapplicationcount ?? 0,
      recommendationCount: data?.Recommendationcount ?? 0,
    },
    isLoading,
    isValidating,
    error,
  };
}
