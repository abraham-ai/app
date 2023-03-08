import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

interface ApiRequest extends NextApiRequest {
  body: {
    username: string
    generators: string[]
    earliestTime: number
    latestTime: number
    limit: number
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { username, generators, earliestTime, latestTime, limit } = req.body;
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    // eden.setAuthToken(authToken)
    // const username = req.session.username;

    const filter = {};
    Object.assign(filter, username ? { username: username } : {})
    Object.assign(filter, generators ? { generators: generators } : {})
    Object.assign(filter, earliestTime ? { earliestTime: earliestTime } : {})
    Object.assign(filter, latestTime ? { latestTime: latestTime } : {})
    Object.assign(filter, limit ? { limit: limit } : {})
    console.log("filter", filter)
    const creations = await eden.getCreations(filter)

    return res.status(200).json({ creations: creations })
  } catch (error: any) {
    if (error.response.data == 'jwt expired') {
      return res.status(401).json({ error: 'Authentication expired' })
    }
    return res.status(500).json({ error: error.response.data })
  }
}

export default withSessionRoute(handler)