import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { SiweMessage } from 'siwe'
import { EdenClient } from 'eden-sdk';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { message, signature, address } = req.body;

  try {    
    await req.session.destroy();
    res.status(200).send({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error logging out" });
  }
};

export default withSessionRoute(handler);
