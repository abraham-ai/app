import { NextApiRequest, NextApiResponse } from "next";
import { getMyCreationsResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

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
    const userId = req.session.userId;
    const result = await getMyCreationsResult(userId);
    return res.status(200).json({ creations: result.data });
  } catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
