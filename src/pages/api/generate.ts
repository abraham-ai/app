import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

interface ApiRequest extends NextApiRequest {
  body: {
    generatorName: string;
    config: any;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { config, generatorName } = req.body;
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    eden.setAuthToken(authToken);
    const result = await eden.create(generatorName, config);
    console.log(result);
    if (result.error) {
      return res.status(500).json({ error: result.error });
    } else {
      return res.status(200).json({ outputUrl: result.outputUrl });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
