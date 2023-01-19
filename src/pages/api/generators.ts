import { getGenerator } from "util/eden";
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const generatorName = req.query.name;
    const generatorVersion = await getGenerator(generatorName);
    return res.status(200).json({ generatorVersion: generatorVersion });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
