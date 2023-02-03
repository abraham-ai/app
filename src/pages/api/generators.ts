import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const generatorName = req.query.name;
    if (generatorName) {
      const generatorVersion = await eden.getGenerator(generatorName);
      return res.status(200).json({ generatorVersion: generatorVersion });
    }
    else {
      return res.status(400).json({ error: "Missing generator name" });
    }    
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
