import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { EdenClient } from 'eden-sdk';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;
  const { note } = req.body;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const eden = new EdenClient();
    eden.setAuthToken(authToken);
    
    const newApiKey = await eden.createNewApiKey(note);
    return res.status(200).json(newApiKey);
  } 
  catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);