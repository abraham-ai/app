import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { EdenClient } from 'eden-sdk';

interface ApiRequest extends NextApiRequest {
  body: {
    message: string;
    signature: string;
    userAddress: string;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { message, signature, userAddress } = req.body;
  const authToken = req.session.token;

  try {
    const eden = new EdenClient();
    eden.setAuthToken(authToken);

    const result = await eden.loginEth(
      message, 
      signature, 
      userAddress
    );

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    req.session.token = result.token;
    req.session.username = userAddress;
    await req.session.save();

    res.send({ message: `Successfully authenticated as ${userAddress}` });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error authenticating key pair" });
  }
};

export default withSessionRoute(handler);
