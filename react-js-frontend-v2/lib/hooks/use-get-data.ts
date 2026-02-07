"use client";

import { useState, useEffect, useCallback, useEffectEvent } from "react";
import { toast } from "sonner";
import { getAuthenticatedData } from "@/lib/api";

interface UseGetDataOptions<T> {
  initialData?: T;
  skip?: boolean;
  errorMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseGetDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

export function useGetData<T>(
  url: string,
  options: UseGetDataOptions<T> = {}
): UseGetDataResult<T> {
  const {
    initialData,
    skip = false,
    errorMessage = "Failed to load data",
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  // Stable event handlers using useEffectEvent
  const onSuccessEvent = useEffectEvent((data: T) => onSuccess?.(data));
  const onErrorEvent = useEffectEvent((error: Error) => onError?.(error));

  const fetchData = useCallback(async () => {
    if (skip) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAuthenticatedData<T>(url);
      if (result !== undefined && result !== null) {
        // Handle nested data response { data: [...] }
        const actualData = (result as { data?: T }).data ?? result;
        setData(actualData as T);
        onSuccessEvent(actualData as T);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onErrorEvent(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [url, skip, errorMessage, onSuccessEvent, onErrorEvent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData, setData };
}
