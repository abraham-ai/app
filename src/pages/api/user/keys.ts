import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;
  const GATEWAY_URL = process.env.GATEWAY_URL as string;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const result = await axios.get(`${GATEWAY_URL}/api-key`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.status(200).json({ apiKeys: result.data });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
