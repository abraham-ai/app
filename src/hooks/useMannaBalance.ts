import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useMannaBalance = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/manna",
    fetcher
  );
  return {
    manna: data?.manna,
    isLoading,
    error: data?.error,
    mutate,
  };
};
