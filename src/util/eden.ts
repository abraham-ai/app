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
  let request = {
    token: authToken,
    application: "heartbeat",
    generator_name: "stable-diffusion",
    config: config,
    metadata: { "user-agent": "examples.eden.art" },
  };
  let responseR = await axios.post(GATEWAY_URL + "/request", request);
  let prediction_id = responseR.data;
  return prediction_id;
};

export const pollResult = async (
  prediction_id: string
): Promise<PollResponse> => {
  const response = await axios.post(GATEWAY_URL + "/fetch", {
    taskIds: [prediction_id],
  });
  let { status, output } = response.data[0];
  if (status == "complete") {
    let outputUrl = `${MINIO_URL}/${MINIO_BUCKET}/${output}`;
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
  let response = await pollResult(prediction_id);
  while (
    response.status == "pending" ||
    response.status == "starting" ||
    response.status == "running"
  ) {
    await new Promise((r) => setTimeout(r, timeout));
    response = await pollResult(prediction_id);
  }
  return response;
};
