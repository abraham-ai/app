import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useApiKeys = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/keys",
    fetcher
  );

  return {
    apiKeys: data?.apiKeys,
    isLoading,
    error: data?.error,
    mutate,
  };
};
