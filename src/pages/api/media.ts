import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (error, _, files) => {
    if (error) {
      return res.status(500).json({error: `Error parsing form`});
    }
    try {
      eden.setAuthToken(authToken);
      const file = files.file as formidable.File;
      const result = await eden.uploadMedia(file.filepath);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.status(200).json({ fileUrl: result.url })
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.response?.data });
    }
  });
}

export default withSessionRoute(handler);
