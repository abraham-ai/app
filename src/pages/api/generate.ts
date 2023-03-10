import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { EdenClient } from 'eden-sdk';

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
    const eden = new EdenClient();
    eden.setAuthToken(authToken);

    const result = await eden.startTask(generatorName, config);
    if (result.error) {
      console.log(result.error)
      return res.status(500).json({ error: result.error });
    } 
    else {
      console.log(`Starting task ${result.taskId}...`)
      return res.status(200).json({ taskId: result.taskId });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
