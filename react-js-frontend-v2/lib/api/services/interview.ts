// Interview API Service

import useSWR, { mutate } from "swr";
import { API_ENDPOINTS } from "@/lib/constants";
import { authMutate } from "@/lib/api/fetcher";
import type { Interview } from "@/lib/types";

const CACHE_KEY = API_ENDPOINTS.INTERVIEWS.LIST;

export function useInterviews() {
  const { data, error, isLoading, isValidating } = useSWR<Interview[]>(CACHE_KEY);

  return {
    interviews: data ?? [],
    isLoading,
    isValidating,
    error,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
  };
}

export async function getInterviewsByFaculty(facultyId: string): Promise<Interview[]> {
  const result = await authMutate<{ faculty_id: string }, Interview[]>(
    API_ENDPOINTS.INTERVIEWS.BY_FACULTY,
    { faculty_id: facultyId }
  );
  return result ?? [];
}

export async function createInterview(
  data: Omit<Interview, "id" | "user_id" | "created_at" | "updated_at">
) {
  const result = await authMutate<typeof data, Interview>(
    API_ENDPOINTS.INTERVIEWS.CREATE,
    data
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function updateInterview(data: Interview) {
  const result = await authMutate<Interview, Interview>(
    API_ENDPOINTS.INTERVIEWS.UPDATE,
    { ...data, updated_at: new Date().toISOString() }
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function deleteInterview(id: string) {
  await authMutate(API_ENDPOINTS.INTERVIEWS.DELETE, { id });
  await mutate(
    CACHE_KEY,
    (current: Interview[] | undefined) =>
      current?.filter((i) => i.id !== id) ?? [],
    { revalidate: false }
  );
}

export { mutate as revalidateInterviews };
