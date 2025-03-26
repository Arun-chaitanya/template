import { useState } from 'react';
import { AxiosError } from 'axios';

interface UseApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  execute: (...args: any[]) => Promise<void>;
}

interface ApiError {
  error: string;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = async (...args: any[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result ?? (Array.isArray(result) ? ([] as T) : null));
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || 'An error occurred');
      if (Array.isArray(data)) setData([] as T);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, execute };
} 