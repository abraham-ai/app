import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "util/withSession";
import { eden } from "util/eden";

interface ApiRequest extends NextApiRequest {
  body: {
    taskId: string;
  };
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { taskId } = req.body;
  const authToken = req.session.token;

  if (!authToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    eden.setAuthToken(authToken);
    const result = await eden.getTaskStatus(taskId);
    if (result.error) {
      console.log("result.error found")
      console.log(result.error)
      return res.status(500).json({ error: result.error });
    } 
    else {
      let response = { task: result.task }
      if (result.task && result.task.creation) {
        const creation = await eden.getCreation(result.task.creation);
        Object.assign(response, { creation: creation });  
      };
      console.log("the response is")
      console.log(response)
      return res.status(200).json(response);
    }
  } catch (error: any) {
    console.log(error)
    console.log("FETCH CAUGHT AN ERORR")
    console.log(error)
    return res.status(500).json({ error: error.response.data });
  }
};

export default withSessionRoute(handler);
