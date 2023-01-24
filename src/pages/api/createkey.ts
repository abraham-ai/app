import { NextApiRequest, NextApiResponse } from "next";
import { createNewApiKey } from "util/eden";
import { withSessionRoute } from "util/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const result = await createNewApiKey(authToken);
    return res.status(200).json({ apiKey: result.apiKey, apiSecret: result.apiSecret });    
  } 
  catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);