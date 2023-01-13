import { NextApiRequest, NextApiResponse } from "next";
import { getGatewayResult } from "util/eden";
// import { AuthMode } from "models/types";
import { withSessionRoute } from "util/withSession";
// import { getAuthToken } from "util/auth";

interface ApiRequest extends NextApiRequest {
  body: {
    prompt: string;
    width: number;
    height: number;
    // authMode: AuthMode;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  //const { prompt, width, height, authMode } = req.body;
  const { prompt, width, height } = req.body;

  const config = {
    mode: "generate",
    text_input: prompt,
    seed: 1e8 * Math.random(),
    sampler: "euler_ancestral",
    scale: 12.0,
    steps: 50,
    width: width,
    height: height,
  };

  //const authToken = getAuthToken(authMode, req.session);
  const authToken = req.session.token; //getAuthToken(authMode, req.session);

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const result = await getGatewayResult(config, authToken);

    return res.status(200).json({ outputUrl: result.outputUrl });
  } catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
