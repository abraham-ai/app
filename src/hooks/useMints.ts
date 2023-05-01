import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useMints = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/mints",
    fetcher
  );

  return {
    mints: data?.mints,
    isLoading,
    error: data?.error,
    mutate,
  };
};
