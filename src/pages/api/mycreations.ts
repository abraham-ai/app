import { NextApiRequest, NextApiResponse } from "next";
import { getMyCreationsResult } from "util/eden";
// import { AuthMode } from "models/types";
import { withSessionRoute } from "util/withSession";
// import { getAuthToken } from "util/auth";

interface ApiRequest extends NextApiRequest {
  body: {
    datefrom: number;
    dateto: number;
    // authMode: AuthMode;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  // const { datefrom, dateto, authMode } = req.body;
  const { datefrom, dateto } = req.body;
  const authToken = req.session.token; //getAuthToken(authMode, req.session);

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const userId = req.session.userId;
    console.log("GOT THE UESer ")
    console.log(userId)
    const result = await getMyCreationsResult(userId);
    return res.status(200).json({ creations: result.data });
  } catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
