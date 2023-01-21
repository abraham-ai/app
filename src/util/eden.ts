import axios, { formToJSON } from "axios";
import fs from 'fs/promises'
const FormData = require('form-data');


const GATEWAY_URL = process.env.GATEWAY_URL;
const MINIO_URL = process.env.MINIO_URL;
const MINIO_BUCKET = process.env.MINIO_BUCKET;

interface PollResponse {
  status: string;
  outputUrl: string | null;
  error: string | null;
}

export const createNewApiKey = async (authToken: string) => {
  let response = await axios.post(GATEWAY_URL + "/api-key/create", {}, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const newApiKey = response.data;
  return newApiKey;
}

export const getGenerator = async (generatorName: string) => {
  const response = await axios.get(GATEWAY_URL + "/generators");
  console.log(response.data.generators);
  const generator = response.data.generators.filter(
    (obj: { generatorName: string; }) => {
      return obj.generatorName === generatorName
    });
  const latestGeneratorVersion = generator[0].versions[0];
  return latestGeneratorVersion;
};

export const uploadMedia = async (authToken: string, filePath: string, fileName: string | null) => {

  // Read image from disk as a Buffer
  const media = await fs.readFile(filePath)

  // Create a form and append image
  
  const form = new FormData();
  form.append('media', media, { filename : fileName ? fileName : ''});
  
  let response = await axios.post(GATEWAY_URL + "/media", form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${authToken}`,
    }
  });

  return response.data;
};

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
