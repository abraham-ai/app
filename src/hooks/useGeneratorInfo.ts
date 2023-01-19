import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useGeneratorInfo = (generatorName: any) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/generators?name=${generatorName}`,
    fetcher,
  );

  return {
    versionId: isLoading ? 'loading' : data?.generatorVersion.versionId,
    defaultParameters: isLoading ? [] : data?.generatorVersion.defaultParameters,
    isLoading,
    error,
    mutate,
  };
};
