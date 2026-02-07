// University API Service

import useSWR, { mutate } from "swr";
import { API_ENDPOINTS } from "@/lib/constants";
import { authMutate } from "@/lib/api/fetcher";
import type { University } from "@/lib/types";

const CACHE_KEY = API_ENDPOINTS.UNIVERSITIES.LIST;

export function useUniversities() {
  const { data, error, isLoading, isValidating } = useSWR<University[]>(CACHE_KEY);

  return {
    universities: data ?? [],
    isLoading,
    isValidating,
    error,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
  };
}

export async function createUniversity(data: Omit<University, "id" | "user_id" | "created_at" | "updated_at">) {
  const result = await authMutate<typeof data, University>(
    API_ENDPOINTS.UNIVERSITIES.CREATE,
    data
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function updateUniversity(data: University) {
  const result = await authMutate<University, University>(
    API_ENDPOINTS.UNIVERSITIES.UPDATE,
    { ...data, updated_at: new Date().toISOString() }
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function deleteUniversity(id: string) {
  await authMutate(API_ENDPOINTS.UNIVERSITIES.DELETE, { id });
  await mutate(
    CACHE_KEY,
    (current: University[] | undefined) =>
      current?.filter((u) => u.id !== id) ?? [],
    { revalidate: false }
  );
}

// Re-export for convenience
export { mutate as revalidateUniversities };
