// Faculty API Service

import useSWR, { mutate } from "swr";
import { API_ENDPOINTS } from "@/lib/constants";
import { authMutate } from "@/lib/api/fetcher";
import type { Faculty } from "@/lib/types";

const CACHE_KEY = API_ENDPOINTS.FACULTIES.LIST;

export function useFaculties(universityId?: string) {
  // Use filtered endpoint if universityId is provided
  const key = universityId
    ? `${API_ENDPOINTS.FACULTIES.BY_UNIVERSITY}?university_id=${universityId}`
    : CACHE_KEY;

  const { data, error, isLoading, isValidating } = useSWR<Faculty[]>(
    universityId ? null : key // Skip SWR fetch for filtered, use manual fetch
  );

  return {
    faculties: data ?? [],
    isLoading,
    isValidating,
    error,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
  };
}

export function useAllFaculties() {
  const { data, error, isLoading, isValidating } = useSWR<Faculty[]>(CACHE_KEY);

  return {
    faculties: data ?? [],
    isLoading,
    isValidating,
    error,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
  };
}

export async function getFacultiesByUniversity(universityId: string): Promise<Faculty[]> {
  const result = await authMutate<{ university_id: string }, Faculty[]>(
    API_ENDPOINTS.FACULTIES.BY_UNIVERSITY,
    { university_id: universityId }
  );
  return result ?? [];
}

export async function createFaculty(
  data: Omit<Faculty, "id" | "user_id" | "created_at" | "updated_at">
) {
  const result = await authMutate<typeof data, Faculty>(
    API_ENDPOINTS.FACULTIES.CREATE,
    data
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function updateFaculty(data: Faculty) {
  const result = await authMutate<Faculty, Faculty>(
    API_ENDPOINTS.FACULTIES.UPDATE,
    { ...data, updated_at: new Date().toISOString() }
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function deleteFaculty(id: string) {
  await authMutate(API_ENDPOINTS.FACULTIES.DELETE, { id });
  await mutate(
    CACHE_KEY,
    (current: Faculty[] | undefined) =>
      current?.filter((f) => f.id !== id) ?? [],
    { revalidate: false }
  );
}

export { mutate as revalidateFaculties };
