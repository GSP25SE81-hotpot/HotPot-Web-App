/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: P) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await apiFunction(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setState({ data: null, loading: false, error: errorMessage });
        throw error;
      }
    },
    [apiFunction]
  );

  return { ...state, execute };
}
