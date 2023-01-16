import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useCreditBalance = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/user/balance",
    fetcher
  );
  return {
    balance: data?.balance,
    isLoading,
    error,
    mutate,
  };
};
