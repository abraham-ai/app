import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { SiweMessage } from 'siwe'
import { EdenClient } from 'eden-sdk';

interface ApiRequest extends NextApiRequest {
  body: {
    message: string;
    signature: string;
    address: string;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { message, signature, address } = req.body;

  try {
    const siweMessage = new SiweMessage(message);
		const fields = await siweMessage.validate(signature);
		if (fields.nonce !== req.session.nonce) {
			return res.status(422).json({ error: "Invalid nonce" });
		}

    const eden = new EdenClient();

    const result = await eden.loginEth(
      message, 
      signature, 
      address
    );

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    req.session.token = result.token;
    req.session.userId = result.userId;
    req.session.username = result.username;
    req.session.address = address;
    
    await req.session.save();

    res.send({ message: `Successfully authenticated as ${address}` });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error authenticating key pair" });
  }
};

export default withSessionRoute(handler);
