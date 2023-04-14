import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {    
    engine: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { engine, prompt, temperature, maxTokens } = req.body;
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const OPENAI_API_KEY = process.env.LM_OPENAI_API_KEY;

    const requestBody = {
      prompt,
      temperature,
      max_tokens: maxTokens,
      n: 1,
    };

    const response = await fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      console.log(data.error)
      return res.status(500).json({ error: data.error });
    }

    const completion = data.choices[0].text;
    return res.status(200).json({ completion: completion });
    
  } 
  catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
