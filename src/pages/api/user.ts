import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, username, address } = req.session;
  return res.status(200).send({username, address, token});
}

export default withSessionRoute(handler)
