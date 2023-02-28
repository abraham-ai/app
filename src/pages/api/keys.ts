import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // eden.setAuthToken(authToken);
    const result = await eden.getApiKeys();
    return res.status(200).json({ apiKeys: result.apiKeys });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
