import { NextApiRequest, NextApiResponse } from "next";
import { getGatewayResult } from "util/eden";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    initImageUrl: string;
    width: number;
    height: number;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { initImageUrl, width, height } = req.body;

  const authToken = req.session.token;

  if (!authToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const config = {
    generatorName: "remix",
    requestConfig: {
      init_image_data: initImageUrl,
      width,
      height,
    },
  };

  try {
    const result = await getGatewayResult(config, authToken);
    if (result.error) {
      console.error(result.error);
      return res.status(500).json({ error: "Error generating image" });
    }
    return res.status(200).json({ outputUrl: result.outputUrl });
  } catch (error: any) {
    if (error.response.data == "jwt expired") {
      return res.status(401).json({ error: "Authentication expired" });
    }
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
