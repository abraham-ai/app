import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { EdenClient } from 'eden-sdk';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const username = req.query.username as string;
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const eden = new EdenClient();
    eden.setAuthToken(authToken);

    const loras = await eden.getLoras(username);
    return res.status(200).json({ loras: loras });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default withSessionRoute(handler);
