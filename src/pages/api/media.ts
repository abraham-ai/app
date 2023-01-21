import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import formidable from "formidable";
import { uploadMedia } from "util/eden";
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;

  // if (!authToken) {
  //   return res.status(401).json({ error: "Not authenticated" });
  // }

  if (req.method === 'POST') {

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {

      if (err) {
        return res.status(500).json({
          error: `Error parsing form`,
        });
      }

      const file = files.file as formidable.File;
      const newFilePath = `public/uploads/${file.originalFilename}`;

      fs.rename(file.filepath, newFilePath, (err) => {
        if (err) {
          res.status(500).json({error: "Unable to move file"})
        }
      });

      try {
        const result = await uploadMedia(authToken!, newFilePath, file.originalFilename);
        res.status(200).json({ fileUrl: `/uploads/${file.originalFilename}` })
      } catch (error: any) {
        return res.status(500).json({ error: error.response?.data });
      }
    });

  } else {
    res.status(405).json({ error: "Method not allowed" })
  }

}

export default withSessionRoute(handler);
