import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, username, address } = req.session;
  const { userAddress } = req.body as { userAddress: string };

  if (userAddress !== address) {
    return res.status(401).send({ error: "Cookie address doesn't match requested wallet address. Need to sign-in again." });
  }
  else {  
    return res.status(200).send({username, address, token});
  }
}

export default withSessionRoute(handler)
