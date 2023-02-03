import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;
  
  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  console.log("LETS GO!!!")
  try {
    console.log("LETS GO 111!!!")
    console.log(authToken)
    console.log(eden)
    console.log(eden.setAuthToken)
    eden.setAuthToken(authToken);
    console.log("LETS GO 222!!!")
    const result = await eden.getManna();
    
    if (result.error) {
      return res.status(500).json({ error: result.error });
    } else {
      return res.status(200).json({ manna: result.manna });
    }
  } 
  catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
