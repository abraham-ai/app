import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, username } = req.session;
  if (token) {
    eden.setAuthToken(token);
  }  
  return res.status(200).send({username, token});
}

export default withSessionRoute(handler)
