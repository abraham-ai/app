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

        console.log("----- 1111 ------")
        console.log(error);
        console.log(error.response);
        console.log("----- 1111 ------")

        return reject(error);
      }
      try {
        const eden = new EdenClient();
        eden.setAuthToken(authToken);
    
        const file = files.file as formidable.File;
        const result = await eden.uploadFile(file.filepath);
        if (result.error) {
          console.log(result);
          console.log(result.error);
          console.log(result.error.response);
          return reject(result.error);
        } else {
          resolve({ fileUrl: result.url });
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage = error.response?.data.message || "Unknown error occurred"; // get error message from response or use default message
        console.log(errorMessage);
        const originalError = error.response?.data.originalError; // get original error object
        console.log(originalError);
        console.error("Failed to upload media: ", originalError || error); // log original error if available, or error
        reject({ error: errorMessage, originalError });
      }
    });
  }).then(result => {
    return res.status(200).json(result);
  }).catch(error => {
    // console.log(error);
    // return res.status(500).json({ error });
    const errorMessage = error.response?.data.message || "Unknown error occurred"; // get error message from response or use default message
    const originalError = error.response?.data.originalError; // get original error object
    console.error("Failed to upload media: ", originalError || error); // log original error if available, or error
    return res.status(500).json({ error: errorMessage, originalError }); // send error message and original error object in response

  });
}

export default withSessionRoute(handler);
