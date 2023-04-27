import fs from "fs";
// import path from "path";
import FormData from "form-data";
// import FormDataNode from 'form-data';
import fetch from "node-fetch";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
// import { exec } from "child_process";

export const config = {
  api: {
    bodyParser: false,
  },
};

console.log("whisper 1")

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  console.log("whisper 2")

  return new Promise((resolve, reject) => {

    console.log("whisper 3")

    form.parse(req, async (error, _, files) => {
      if (error) {
        console.log("whisper 4")
        console.log(error);
        return reject(error);
      }
      try {
        console.log("whisper 5")
        // const file = files.file as formidable.File;
        const file = files.file as unknown as formidable.File;


        const buffer = fs.readFileSync(file.filepath);


        // console.log("whisper 5a")
        // const inputFile = file.filepath;
        // console.log("whisper 5b")
        // const outputFile = path.join(path.dirname(inputFile), `${path.basename(inputFile, path.extname(inputFile))}.wav`);
        // console.log("whisper 7")
        // const command = `ffmpeg -i ${inputFile} -acodec pcm_s16le -ac 1 -ar 16000 ${outputFile}`;

        // console.log("run ffmppg command: ", command);

        // exec(command, async (error, stdout, stderr) => {
        //   console.log("whisper 6")

        //   if (error) {
        //     console.log("whisper 8")
        //     console.error(`ffmpeg error: ${error}`);
        //     reject({ error });
        //     return;
        //   }

        //   console.log("whisper 9")

        //   const buffer = fs.readFileSync(outputFile);
        //   console.log("whisper 9a")
        //   const blob = new Blob([buffer], { type: "audio/wav" });
        //   console.log("whisper 9b")

        //   const data = new FormData();
        //   console.log("whisper 9c")
        //   data.append("file", blob, "test.wav");
        //   console.log("whisper 9d")
        //   data.append("model", "whisper-1");
        //   data.append("language", "en");
        //   console.log("whisper 9e")

        //   const OPENAI_API_KEY = process.env.LM_OPENAI_API_KEY;
        //   console.log("whisper 9f")
        //   const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        //     headers: {
        //       Authorization: `Bearer ${OPENAI_API_KEY}`,
        //     },
        //     method: "POST",
        //     body: data,
        //   });

        //   console.log("whisper 10, result")
        //   console.log(response)
          


        //   const result = await response.json();
          
        //   console.log("======")
        //   console.log(result);
        //   console.log("======")
          

        //   resolve({ text: result.text });

        //   fs.unlinkSync(outputFile); // remove the temporary WAV file
        // });

        console.log("whsip 1")

        const data = new FormData();
        // data.append("file", new Blob([buffer], { type: "audio/wav" }), "test.wav");
        data.append('file', fs.createReadStream(file.filepath), "test.wav");
        data.append("model", "whisper-1");
        data.append("language", "en");

        console.log("whsip 2")

        const OPENAI_API_KEY = process.env.LM_OPENAI_API_KEY;
        
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          method: "POST",
          body: data,
        });

        const result = await response.json();
        
        
        console.log("======")
        console.log(result);
        console.log("======")

        
        console.log("DID THIS WORK???")

        resolve({ text: result.text });




      } catch (error: any) {
        console.log(error);
        reject({ error });
      }
    });
  }).then((result) => {
    console.log("whisper 15")
    return res.status(200).json(result);
  }).catch((error) => {
    console.log("whisper 16")
    return res.status(500).json({ error });
  });
};

export default handler;
