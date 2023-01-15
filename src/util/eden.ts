import axios from "axios";

const GATEWAY_URL = process.env.GATEWAY_URL;
const MINIO_URL = process.env.MINIO_URL;
const MINIO_BUCKET = process.env.MINIO_BUCKET;

interface PollResponse {
  status: string;
  outputUrl: string | null;
  error: string | null;
}

export const submitPrediction = async (config: any, authToken: string) => {
  const { generatorName, requestConfig } = config;
  let request = {
    generatorName,
    config: requestConfig,
  };
  let responseR = await axios.post(GATEWAY_URL + "/tasks/create", request, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const prediction_id = responseR.data.taskId;
  return prediction_id;
};

export const pollResult = async (
  prediction_id: string,
  authToken: string
): Promise<PollResponse> => {
  const data = { taskIds: [prediction_id] };
  const response = await axios.post(GATEWAY_URL + "/tasks/fetch", data, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  let { status, output } = response.data.tasks[0];
  if (status == "completed") {
    const finalOutput = output.slice(-1);
    const outputUrl = `${MINIO_URL}/${MINIO_BUCKET}/${finalOutput}`;
    return { status, outputUrl, error: null };
  } else if (status == "failed") {
    return { status, outputUrl: null, error: "Prediction failed" };
  }
  return { status, outputUrl: null, error: null };
};

export const getGatewayResult = async (
  config: any,
  authToken: string,
  timeout: number = 2000
) => {
  let prediction_id = await submitPrediction(config, authToken);
  let response = await pollResult(prediction_id, authToken);
  while (
    response.status == "pending" ||
    response.status == "starting" ||
    response.status == "running"
  ) {
    await new Promise((r) => setTimeout(r, timeout));
    response = await pollResult(prediction_id, authToken);
  }
  return response;
};

export const getMyCreationsResult = async (
  userId: string | undefined,
  timeout: number = 2000
) => {
  await new Promise((r) => setTimeout(r, timeout));
  const response = userId
    ? await axios.post(GATEWAY_URL + "/fetch", {
        userIds: [userId],
      })
    : { data: [] };
  return response;
};
