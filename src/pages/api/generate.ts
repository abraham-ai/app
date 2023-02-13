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
    console.log("====================================");
    console.log("generatorName");
    console.log(generatorName);
    console.log("config");
    console.log(config);
    console.log("lets do a job....");
    const result = await eden.create(generatorName, config);
    console.log("THE RESULT ...")
    console.log(result);
    if (result.error) {
      console.log("I GOT AN ERROR")
      console.log(result.error);
      console.log("====================================");
      return res.status(500).json({ error: result.error });
    } else {
      console.log("result.task.output");
      console.log(result);
      return res.status(200).json({ creation: result });
    }
  } catch (error: any) {
    console.log("I GOT AN ERROR 22")
    console.log(error);
    console.log("====================================");
  return res.status(500).json({ error: error });
  }
};

export default withSessionRoute(handler);
