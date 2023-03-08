import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useLoras = (username: string) => {
  const route = username 
    ? `/api/loras?username=${username}` 
    : `/api/loras`;

  const { data, error, isLoading, mutate } = useSWR(
    route,
    fetcher
  );
  return {
    loras: data?.loras,
    isLoading,
    error: data?.error,
    mutate,
  };
};
