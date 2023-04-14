import fs from "fs";
import path from "path";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (error, _, files) => {
      if (error) {
        return reject(error);
      }
      try {
        const file = files.file as formidable.File;
        const inputFile = file.filepath;
        const outputFile = path.join(path.dirname(inputFile), `${path.basename(inputFile, path.extname(inputFile))}.wav`);

        const command = `ffmpeg -i ${inputFile} -acodec pcm_s16le -ac 1 -ar 16000 ${outputFile}`;

        exec(command, async (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            reject({ error });
            return;
          }

          const buffer = fs.readFileSync(outputFile);
          const blob = new Blob([buffer], { type: "audio/wav" });

          const data = new FormData();
          data.append("file", blob, "test.wav");
          data.append("model", "whisper-1");
          data.append("language", "en");

          const OPENAI_API_KEY = process.env.LM_OPENAI_API_KEY;
          const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            method: "POST",
            body: data,
          });

          const result = await response.json();
          console.log(result);

          resolve({ text: result.text });

          fs.unlinkSync(outputFile); // remove the temporary WAV file
        });
      } catch (error: any) {
        console.log(error);
        reject({ error });
      }
    });
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(500).json({ error });
  });
};

export default handler;
