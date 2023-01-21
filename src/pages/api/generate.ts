import { NextApiRequest, NextApiResponse } from "next";
import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    generatorName: string;
    reqConfig: any;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { reqConfig, generatorName } = req.body;
  const authToken = req.session.token;

  const config = {
    generatorName: generatorName,
    requestConfig: reqConfig,
  };

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    console.log("aa1")
    const result = await getGatewayResult(config, authToken);
    console.log("aa2")
    console.log(result);
    if (result.error) {
      return res.status(500).json({ error: result.error });
    } else {
      return res.status(200).json({ outputUrl: result.outputUrl });
    }
  } catch (error: any) {
    console.log("Error")
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
