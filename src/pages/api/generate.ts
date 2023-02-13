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
    if (result.error) {
      return res.status(500).json({ error: result.error });
    } else {
      console.log("result.task.output");
      console.log(result);
      return res.status(200).json({ creation: result });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export default withSessionRoute(handler);
