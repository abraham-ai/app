import useSWR from "swr";
import { fetcher } from "util/fetcher";

export const useGeneratorInfo = (generatorName: any) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/generators?name=${generatorName}`,
    fetcher,
  );

  if (isLoading) {
    return {
      versionId: 'loading',
      requiredParameters: [],
      optionalParameters: [],
      isLoading,
      error,
      mutate,
    };
  }

  const requiredParameters = data?.generatorVersion.parameters.filter(
    (parameter: { optional: boolean; }) => !parameter.optional
  );

  const optionalParameters = data?.generatorVersion.parameters.filter(
    (parameter: { optional: boolean; }) => parameter.optional
  );

  return {
    versionId: data?.generatorVersion.versionId,
    requiredParameters: requiredParameters,
    optionalParameters: optionalParameters,
    isLoading,
    error,
    mutate,
  };
};
