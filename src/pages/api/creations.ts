import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

interface ApiRequest extends NextApiRequest {
  body: {
    datefrom: number;
    dateto: number;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { datefrom, dateto } = req.body;
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    eden.setAuthToken(authToken);
    const userId = req.session.userId;
    const filter = {
      userId: userId
    };
    const creations = await eden.getCreations(filter);
    return res.status(200).json({ creations: creations });
  } 
  catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
