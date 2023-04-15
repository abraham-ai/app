import React, { useState, useRef, useEffect } from "react";
import { Button, Space } from "antd";
import axios from "axios";
import ImageResult from "components/media/ImageResult";


const Voice2Image = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [convertedText, setConvertedText] = useState<string>("");
  const [recording, setRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [creation, setCreation] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = () => {
    const constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const sendAudio = async () => {
    console.log("Send audio 1")
    setLoading(true);
    console.log("Send audio 2")
    const data = new FormData();
    data.append("file", audioBlob as Blob);
    data.append("model", "whisper-1");
    data.append("language", "en");
    console.log("Send audio 3")

    const res = await fetch("/api/whisper", {
      method: "POST",
      body: data,
    });

    console.log("Send audio 4")
    console.log(res);

    const result = await res.json();
    console.log(result);

    setLoading(false);
    setConvertedText(result.text);
  };



  const pollForResult = async (taskId: string, pollingInterval: number = 2000) => {
    console.log("polling", taskId);
    let response = await axios.post("/api/fetch", { taskId: taskId });
    let task = response.data.task;
    console.log("task", task)
    while (
      task.status == "pending" ||
      task.status == "starting" ||
      task.status == "running"
    ) {
      await new Promise((r) => setTimeout(r, pollingInterval));
      response = await axios.post("/api/fetch", { taskId: taskId });
      console.log("polling", response.data.task);
      task = response.data.task;
    }
    if (task.status == "failed") {
      throw new Error(task.error.message);
    } else if (!response.data.creation) {
      throw new Error("No creation found");
    };

    console.log("result DATA", response.data)

    return response.data.creation;
  };
  
  const requestCreation = async (prompt: string) => {
    console.log("req a crea")
    try {
      
      const config = {
        text_input: prompt,
        seed: Math.floor(Math.random() * 1000000),
      }
      console.log("lets go con", config)
      const response = await axios.post("/api/generate", {
        generatorName: "create",
        config: config,
      });
      console.log("res", response)
      const taskId = response.data.taskId;
      console.log("task", taskId)
      const creation = await pollForResult(taskId);
      console.log("creation!", creation)
      setCreation(creation);
    }
    catch (error: any) {
      console.log(error)
    }
  };

  const gptCompletion = async (prompt: string) => {
    const response = await axios.post("/api/gpt", {
      engine: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 60,
    });  
    const completion = response.data.completion;
    console.log(completion);
  };

  useEffect(() => {
    if (!convertedText) {
      return;
    }
    // gptCompletion(convertedText);
    requestCreation(convertedText);

  }, [convertedText]);

  const handleDataAvailable = (event: BlobEvent) => {
    setAudioBlob(event.data);
  };

  const handleStop = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
      mediaRecorder.removeEventListener("stop", handleStop);
    }
  };

  if (recording) {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorder.addEventListener("stop", handleStop);
    }
  }

  return (
    <div>
      <Space>
        {recording ? <Button type="primary" size="large" style={{backgroundColor: "red", color: "white"}} onClick={stopRecording} disabled={loading}>
          Stop
        </Button> : <Button type="primary" size="large" onClick={startRecording} disabled={loading}>
          Record
        </Button>}
        <Button type="primary" size="large" onClick={sendAudio} disabled={loading || !audioBlob}>
          Send audio
        </Button>
        {loading ? <p>loading...</p> : null}
        {/* <p>{creation?.uri} is uri</p> */}
        <p>
        {creation ? <ImageResult resultUrl={creation.uri} /> : null}
        </p>
      </Space>
      <div>
        {convertedText}
      </div>    
    </div>
  );
};

export default Voice2Image;
