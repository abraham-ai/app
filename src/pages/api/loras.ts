import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = null; //req.query.userId as string;
    const loras = await eden.getLoras(userId);
    return res.status(200).json({ loras: loras });
  } catch (error: any) {
    console.error(error);
    //return res.status(500).json({ error: error.response.data });
    return res.status(500).json({ error: error.message });
  }
};

export default withSessionRoute(handler);
