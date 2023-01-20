import { NextApiRequest, NextApiResponse } from "next";
import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    reqConfig: any;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { reqConfig } = req.body;
  const authToken = req.session.token;

  const config = {
    generatorName: "create",
    requestConfig: reqConfig,
  };

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const result = await getGatewayResult(config, authToken);
    return res.status(200).json({ outputUrl: result.outputUrl });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
