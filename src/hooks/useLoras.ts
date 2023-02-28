import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useLoras = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/loras",
    fetcher
  );
  return {
    loras: data?.loras,
    isLoading,
    error: data?.error,
    mutate,
  };
};
