import { NextApiRequest, NextApiResponse } from "next";

import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    prompt1: string;
    prompt2: string;
    width: number;
    height: number;
    numFrames: number;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { prompt1, prompt2, width, height, numFrames } = req.body;

  const interpolation_texts = [prompt1, prompt2];

  const config = {
    generatorName: "interpolate",
    requestConfig: {
      interpolation_texts,
      interpolation_seeds: [1e8 * Math.random(), 1e8 * Math.random()],
      width,
      height,
      n_frames: numFrames,
    },
  };

  const authToken = req.session.token;

  if (!authToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const result = await getGatewayResult(config, authToken);
    console.log("resss", result);
    if (result.error) {
      console.error(result.error);
      return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ outputUrl: result.outputUrl });
  } catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
