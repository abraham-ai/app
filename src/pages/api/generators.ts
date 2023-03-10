import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { EdenClient } from 'eden-sdk';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const generatorName = req.query.name as string;
    if (generatorName) {
      const eden = new EdenClient();
      const generatorVersion = await eden.getGenerator(generatorName);
      return res.status(200).json({ generatorVersion: generatorVersion });
    }
    else {
      return res.status(400).json({ error: "Missing generator name" });
    }    
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default withSessionRoute(handler);
