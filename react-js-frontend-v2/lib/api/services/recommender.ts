// Recommender API Service

import useSWR, { mutate } from "swr";
import { API_ENDPOINTS } from "@/lib/constants";
import { authMutate } from "@/lib/api/fetcher";
import type { Recommender } from "@/lib/types";

const CACHE_KEY = API_ENDPOINTS.RECOMMENDERS.LIST;

export function useRecommenders() {
  const { data, error, isLoading, isValidating } = useSWR<Recommender[]>(CACHE_KEY);

  return {
    recommenders: data ?? [],
    isLoading,
    isValidating,
    error,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
  };
}

export async function createRecommender(
  data: Omit<Recommender, "id" | "user_id" | "created_at" | "updated_at">
) {
  const result = await authMutate<typeof data, Recommender>(
    API_ENDPOINTS.RECOMMENDERS.CREATE,
    data
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function updateRecommender(data: Recommender) {
  const result = await authMutate<Recommender, Recommender>(
    API_ENDPOINTS.RECOMMENDERS.UPDATE,
    { ...data, updated_at: new Date().toISOString() }
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function deleteRecommender(id: string) {
  await authMutate(API_ENDPOINTS.RECOMMENDERS.DELETE, { id });
  await mutate(
    CACHE_KEY,
    (current: Recommender[] | undefined) =>
      current?.filter((r) => r.id !== id) ?? [],
    { revalidate: false }
  );
}

export { mutate as revalidateRecommenders };
