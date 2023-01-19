import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useApiKeys = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/user/keys",
    fetcher
  );

  return {
    apiKeys: data?.apiKeys,
    isLoading,
    error,
    mutate,
  };
};
