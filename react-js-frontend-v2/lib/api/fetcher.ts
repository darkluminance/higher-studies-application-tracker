// Authenticated Fetcher for SWR

import { STORAGE_KEYS } from "@/lib/constants";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/v1";

export class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

/**
 * Authenticated fetcher for SWR GET requests
 */
export async function authFetcher<T>(url: string): Promise<T> {
  if (typeof window === "undefined") {
    throw new FetchError("Cannot fetch on server", 500);
  }

  const token = sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    throw new FetchError("No authentication token", 401);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    const data = await response.json();
    if (data.error === "Invalid token") {
      sessionStorage.clear();
      window.location.href = "/login";
      throw new FetchError("Session expired", 401);
    }
    throw new FetchError(data.error || "Unauthorized", 401);
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new FetchError(
      data.error || `Request failed: ${response.statusText}`,
      response.status
    );
  }

  const data = await response.json();
  // Handle nested data response { data: [...] }
  return data?.data ?? data;
}

/**
 * Authenticated mutate function for POST/PUT/DELETE
 */
export async function authMutate<TData, TResponse = unknown>(
  url: string,
  data: TData,
  method: "POST" | "PUT" | "DELETE" = "POST"
): Promise<TResponse> {
  if (typeof window === "undefined") {
    throw new FetchError("Cannot mutate on server", 500);
  }

  const token = sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    throw new FetchError("No authentication token", 401);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    const respData = await response.json();
    if (respData.error === "Invalid token") {
      sessionStorage.clear();
      window.location.href = "/login";
      throw new FetchError("Session expired", 401);
    }
    throw new FetchError(respData.error || "Unauthorized", 401);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  if (!response.ok) {
    const respData = await response.json().catch(() => ({}));
    throw new FetchError(
      respData.error || `Request failed: ${response.statusText}`,
      response.status
    );
  }

  const respData = await response.json();
  return respData?.data ?? respData;
}
