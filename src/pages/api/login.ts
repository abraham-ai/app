import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";

interface ApiRequest extends NextApiRequest {
  body: {
    message: string;
    signature: string;
    userAddress: string;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { message, signature, userAddress } = req.body;
  const GATEWAY_URL = process.env.GATEWAY_URL as string;

  try {
    const gatewayRes = await axios.post(`${GATEWAY_URL}/auth/login`, {
      message,
      signature,
      address: userAddress,
    });
    const { token } = gatewayRes.data;
    req.session.token = token;
    req.session.userId = userAddress;
    await req.session.save();

    res.send({ message: "Successfully authenticated key pair" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error authenticating key pair" });
  }
};

export default withSessionRoute(handler);
