import { NextApiRequest, NextApiResponse } from "next";
import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    prompt: string;
    width: number;
    height: number;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { prompt, width, height } = req.body;
  console.log("go!")
  console.log(prompt, width, height);

  return res.status(403).json({ error: "Ooops" });
  
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

  const authToken = req.session.token;

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
