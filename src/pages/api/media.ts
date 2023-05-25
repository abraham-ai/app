import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { EdenClient } from 'eden-sdk';

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

  return new Promise((resolve, reject) => {
    form.parse(req, async (error, _, files) => {
      if (error) {
        return reject(error.message);
      }
      try {
        const eden = new EdenClient();
        eden.setAuthToken(authToken);    
        const file = files.file as formidable.File;
        const result = await eden.uploadFile(file.filepath);
        if (result.error) {          
          return reject(result.error);
        } else {
          resolve({ fileUrl: result.url });
        }
      } catch (error: any) {
        const errorMessage = error.response?.data.message || "Unknown error occurred"; // get error message from response or use default message
        const originalError = error.response?.data.originalError; // get original error object
        reject({ error: errorMessage, originalError }); // send error message and original error object in response
      }
    });
  }).then(result => {
    return res.status(200).json(result);
  }).catch(error => {
    return res.status(500).json({ error });
  });
}

export default withSessionRoute(handler);
