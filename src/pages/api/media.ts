import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {  
  return res.status(500).json({ error: "Not implemented" });
};

export default withSessionRoute(handler);
