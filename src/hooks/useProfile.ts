import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useProfile = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/profile",
    fetcher
  );
  return {
    profile: data?.profile,
    isLoading,
    error: data?.error,
    mutate,
  };
};
