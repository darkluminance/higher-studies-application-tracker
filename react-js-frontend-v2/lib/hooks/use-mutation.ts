"use client";

import { useState, useCallback, useEffectEvent } from "react";
import { toast } from "sonner";
import { postAuthenticatedData } from "@/lib/api";

interface UseMutationOptions<TResponse> {
  onSuccess?: (data: TResponse | null) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseMutationResult<TData, TResponse> {
  mutate: (data: TData) => Promise<TResponse | null>;
  isLoading: boolean;
  error: Error | null;
}

export function useMutation<TData, TResponse = unknown>(
  url: string,
  options: UseMutationOptions<TResponse> = {}
): UseMutationResult<TData, TResponse> {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage = "Operation failed",
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Stable event handlers using useEffectEvent
  const onSuccessEvent = useEffectEvent((data: TResponse | null) => onSuccess?.(data));
  const onErrorEvent = useEffectEvent((error: Error) => onError?.(error));

  const mutate = useCallback(
    async (data: TData): Promise<TResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await postAuthenticatedData<TData, TResponse>(url, data);
        if (successMessage) toast.success(successMessage);
        onSuccessEvent(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onErrorEvent(error);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url, successMessage, errorMessage, onSuccessEvent, onErrorEvent]
  );

  return { mutate, isLoading, error };
}
