import React, { useState, useCallback } from "react";
import axios from "axios";
import { Button } from "antd";
import ImageResult from "components/media/ImageResult";
import VideoResult from "components/media/VideoResult";
import AudioResult from "components/media/AudioResult";
import TextResult from "components/media/TextResult";


const Player = () => {

  const [resultUrl, setResultUrl] = useState<string>("");
  const [creation, setCreation] = useState<any>({});

  const [cutoffTime, setCutoffTime] = useState<number | null>(null)
  
  const [loading, setLoading] = useState<boolean>(false)

  const getMoreCreations = async () =>{
    setLoading(true)

    try {
      let filter = {
        latestTime: cutoffTime,
        limit: 1,
        generators: ["create", "remix"]
      }

      // if (username != null) {
      //   filter = Object.assign(filter, { username })
      // }

      const response = await axios.post('/api/creations', filter)

      console.log(response.data);

      const nextCreations =
        response.data.creations &&
        response.data.creations.map((creation: any) => {
          return {
            key: creation._id,
            address: creation.user,
            uri: creation.uri,
            timestamp: creation.createdAt,
            task: creation.task,
            // prompt: creation.task.config.text_input,
            // status: creation.task.status,
            // generator: creation.task.generator.generatorName,
          }
        })

      if (nextCreations.length == 0) {
        setLoading(false)        
        return
      }

      setCreation(nextCreations[0]);

      const nextCreation = nextCreations[0]
      const earliestTime = Date.parse(nextCreation.timestamp) - 1
      setCutoffTime(earliestTime)
    } catch (error: any) {
      console.error(error)
      //setMessage(`Error:`)
    }
    setLoading(false)
  }

  return (
    <>
    hi there 
    <Button onClick={getMoreCreations}>Get More Creations</Button>
    {creation && creation.uri }
    {creation && creation.uri && (
        <>
          <ImageResult resultUrl={creation.uri} />
        </>
      )}  
    </>
  );
};

export default Player;
