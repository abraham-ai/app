import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { EdenClient } from 'eden-sdk';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.session.token;
  const { code } = req.body;

  console.log("code: ", code);


  const eden = new EdenClient();
  const apiUrl = eden.getApiUrl();
console.log("apiUrl: ", apiUrl);


  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  console.log("go 1: ");
  try {
    console.log("apiUrl: ", apiUrl);
    console.log("go 2: ");
    const response = await fetch(`${apiUrl}/user/manna/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({mannaVoucherId: code}),
    });    

    console.log("response!: ", response);

    const edenResponse = await response.json();
    console.log("edenResponse: ", edenResponse);

    if (response.ok) {
      

      return res.status(200).json(edenResponse);
    } 
    else {
      console.log("NO 2!")
      return res.status(500).json({ error: edenResponse.message });
    }
  } 
  catch (error: any) {
    console.log("NO 1!")
    console.log("error: ", error);

    console.log("NO!")
    return res.status(500).json({error: error.message});
  }
};

export default withSessionRoute(handler);
