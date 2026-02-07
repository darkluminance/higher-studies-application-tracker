// Mail API Service

import useSWR, { mutate } from "swr";
import { API_ENDPOINTS } from "@/lib/constants";
import { authMutate } from "@/lib/api/fetcher";
import type { Mail } from "@/lib/types";

const CACHE_KEY = API_ENDPOINTS.MAILS.LIST;

export function useMails() {
  const { data, error, isLoading, isValidating } = useSWR<Mail[]>(CACHE_KEY);

  return {
    mails: data ?? [],
    isLoading,
    isValidating,
    error,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
  };
}

export async function createMail(
  data: Omit<Mail, "id" | "user_id" | "faculty_name" | "created_at" | "updated_at">
) {
  const result = await authMutate<typeof data, Mail>(
    API_ENDPOINTS.MAILS.CREATE,
    data
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function updateMail(data: Mail) {
  const result = await authMutate<Mail, Mail>(
    API_ENDPOINTS.MAILS.UPDATE,
    { ...data, updated_at: new Date().toISOString() }
  );
  await mutate(CACHE_KEY);
  return result;
}

export async function deleteMail(id: string) {
  await authMutate(API_ENDPOINTS.MAILS.DELETE, { id });
  await mutate(
    CACHE_KEY,
    (current: Mail[] | undefined) => current?.filter((m) => m.id !== id) ?? [],
    { revalidate: false }
  );
}

export { mutate as revalidateMails };
