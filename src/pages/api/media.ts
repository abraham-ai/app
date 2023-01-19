import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import formidable from "formidable";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  console.log("handle 11")
  console.log(req.method)
  if (req.method === 'POST') {
    console.log("handle 12")
    const form = new formidable.IncomingForm();
    console.log("handle 12a")
    form.parse(req, (err, fields, files) => {
      console.log("go!")

      if (err) {
        console.log("err")
        res.status(500).json({error: "Unable to upload file"})
        return;
      }
      // File saved to `files.file.path`
      const file = files.file;
      const filePath = `public/uploads/${file.name}`;
      
      console.log("=======")
      console.log(file);
      console.log(filePath);

      res.status(200).json({ fileUrl: `/uploads/${file.name}` })

      // Move file to public/uploads directory
      /*fs.rename(file.path, filePath, (err) => {
        if (err) {
          res.status(500).json({error: "Unable to move file"})
        }
        res.status(200).json({ fileUrl: `/uploads/${file.name}` });
      });*/
      
    });
  } else {
    console.log("handle 13")
    res.status(405).json({error: "Method not allowed"})
  }

  console.log("handle 14")

  // console.log(req.body.file)
  // const { reqConfig } = req.body;
  // const authToken = req.session.token;

  // const config = {
  //   generatorName: "create",
  //   requestConfig: reqConfig,
  // };

  // if (!authToken) {
  //   return res.status(401).json({ error: "Not authenticated" });
  // }

  // try {
  //   const result = await getGatewayResult(config, authToken);
  //   return res.status(200).json({ outputUrl: result.outputUrl });
  // } catch (error: any) {
  //   console.error(error);
  //   return res.status(500).json({ error: error.response.data });
  // }
};

export default withSessionRoute(handler);
