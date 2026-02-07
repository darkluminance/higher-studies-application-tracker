// Application API Service

import useSWR, { mutate } from "swr";
import { API_ENDPOINTS } from "@/lib/constants";
import { authMutate } from "@/lib/api/fetcher";
import type { Application } from "@/lib/types";

const CACHE_KEY = API_ENDPOINTS.APPLICATIONS.LIST;

export function useApplications() {
  const { data, error, isLoading, isValidating } = useSWR<Application[]>(CACHE_KEY);

  return {
    applications: data ?? [],
    isLoading,
    isValidating,
    error,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
  };
}

export async function createApplication(
  data: Omit<Application, "id" | "user_id" | "created_at" | "updated_at">
) {
  const result = await authMutate<typeof data, Application>(
    API_ENDPOINTS.APPLICATIONS.CREATE,
    data
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function updateApplication(data: Application) {
  const result = await authMutate<Application, Application>(
    API_ENDPOINTS.APPLICATIONS.UPDATE,
    { ...data, updated_at: new Date().toISOString() }
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function deleteApplication(id: string) {
  await authMutate(API_ENDPOINTS.APPLICATIONS.DELETE, { id });
  await mutate(
    CACHE_KEY,
    (current: Application[] | undefined) =>
      current?.filter((a) => a.id !== id) ?? [],
    { revalidate: false }
  );
}

export { mutate as revalidateApplications };
