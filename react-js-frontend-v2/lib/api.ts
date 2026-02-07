// API Utilities for TrackGrad

import { STORAGE_KEYS } from "./constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/v1";

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

async function handleResponse<T>(response: Response): Promise<T | null> {
  const status = response.status;

  if (status === HttpStatus.UNAUTHORIZED) {
    const data = await response.json();
    if (data.error === "Invalid token") {
      sessionStorage.clear();
      window.location.href = "/login";
      return null;
    }
    throw new Error(data.error || "Unauthorized");
  }

  if (status === HttpStatus.NO_CONTENT) {
    return null;
  }

  if (status >= 400) {
    const data = await response.json();
    throw new Error(data.error || "An error occurred");
  }

  const data = await response.json();
  return data?.data || data;
}

export async function getAuthenticatedData<T>(url: string): Promise<T | null> {
  const token = getAuthToken();
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<T>(response);
}

export async function postAuthenticatedData<T, R>(
  url: string,
  data: T
): Promise<R | null> {
  const token = getAuthToken();
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<R>(response);
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string } | null> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "GET",
    headers: {
      Authorization: `${username}:${password}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Invalid credentials");
  }

  return response.json();
}

export async function register(data: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed");
  }
}

export async function getCurrentUser(): Promise<{
  name: string;
  username: string;
  email: string;
} | null> {
  return getAuthenticatedData("/users/user/get");
}

// Helper function to format dates for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper function to format dates for API submission
export function toISODate(dateString: string): string {
  return new Date(dateString).toISOString();
}

// Helper function to parse ISO date for form inputs
export function parseISODate(isoString: string): string {
  return new Date(isoString).toISOString().split("T")[0];
}
