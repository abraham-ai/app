import React, { useState, useRef, useEffect } from "react";
import { Button, Space } from "antd";
import axios from "axios";
import Recorder from 'recorder-js';
import ImageResult from "components/media/ImageResult";


const system_description = `You're a conversation assistant that creates descriptions of thought provoking images that are shown alongside ongoing conversations and presentations. Based on the transcript of the conversation, you create a visual description of an image relevant to the current topic of conversation.`

const task_description = `Create a visual description of an image that's relevant to the conversation transcript that follows. The image description should be specific: dont describe what the image evokes, just describe what's in it.

The description will be used by a generative AI model to generate an image that will be displayed live to the audience during the presentation. At the end of the image description you can optionally add (comma separated) style modifiers to make the generated image look better and more realistic.

The image description should be maximum 60 words long and it should be obvious how the image is related to the conversation.

Here's the transcript of the most recent section of the conversation (pay most attention to the last two sentences since those are the most recent):`


const Voice2Image = () => {
  const [sendingAudio, setSendingAudio] = useState<boolean>(false);
  const [sdReady, setSdReady] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<string>("");
  const [recording, setRecording] = useState<boolean>(false);
  const [autoRecording, setAutoRecording] = useState<boolean>(false);
  const [creation, setCreation] = useState<any>(null);

  const recorderInstanceRef = useRef<Recorder | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const shouldContinueRef = useRef<boolean>(false);
  const textBufferRef = useRef<string[]>([]);
  const promptBufferRef = useRef<string>("");
  const completionRef = useRef<string>("");

  const startRecording = () => {
    const constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const audioContext = new AudioContext();
      const recorder = new Recorder(audioContext);
      recorder.init(stream);
      recorder.start();
      recorderInstanceRef.current = recorder;
      setRecording(true);
    });
  };
  
  const stopRecording = async () => {
    if (recorderInstanceRef.current) {
      const { blob } = await recorderInstanceRef.current.stop();
      audioBlobRef.current = blob;
      setRecording(false);
    }
  };

  const runAutoRecording = async () => {
    while (shouldContinueRef.current) {
      startRecording();
      await new Promise((resolve) => setTimeout(resolve, 8000));
      await stopRecording();
      await sendAudio();
    }
  };
  
  useEffect(() => {
    if (autoRecording) {
      shouldContinueRef.current = true;
      runAutoRecording();
    } else {
      shouldContinueRef.current = false;
    }
  }, [autoRecording]);

  const startAutoRecording = () => {
    setAutoRecording(true);
  };
  
  const stopAutoRecording = () => {
    setAutoRecording(false);
  };
  
  const sendAudio = async () => {
    setSendingAudio(true);
    const data = new FormData();
    data.append("file", audioBlobRef.current as Blob);    
    data.append("model", "whisper-1");
    data.append("language", "en");

    const response = await fetch("/api/whisper", {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    textBufferRef.current = [...textBufferRef.current.slice(-4), result.text];

    const prompt = `${task_description}\n\n${textBufferRef.current.join("\n")}.\n\nNow describe the image.`;
    promptBufferRef.current = prompt;
    
    setLastResult(result.text)
    setSendingAudio(false);

    if (!sdReady) {
      setSdReady(true);
    }
  };

  const pollForResult = async (taskId: string, pollingInterval: number = 2000) => {
    let response = await axios.post("/api/fetch", { taskId: taskId });
    let task = response.data.task;
    while (
      task.status == "pending" ||
      task.status == "starting" ||
      task.status == "running"
    ) {
      await new Promise((r) => setTimeout(r, pollingInterval));
      response = await axios.post("/api/fetch", { taskId: taskId });
      task = response.data.task;
    }
    if (task.status == "failed") {
      throw new Error(task.error.message);
    } else if (!response.data.creation) {
      throw new Error("No creation found");
    };
    return response.data.creation;
  };

  const gptCompletion = async () => {
    const prompt = promptBufferRef.current;
    const response = await axios.post("/api/gpt", {
      engine: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 60,
    });  
    const completion = response.data.completion;
    completionRef.current = completion;
    return completion;
  };

  const requestCreation = async () => {
    const prompt = completionRef.current;
    try {
      const config = {
        text_input: prompt,
        seed: Math.floor(Math.random() * 1000000),
      }
      const response = await axios.post("/api/generate", {
        generatorName: "create",
        config: config,
      });
      const taskId = response.data.taskId;
      const creation = await pollForResult(taskId);
      setCreation(creation);
    }
    catch (error: any) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (!sdReady) {
      return;
    }
    (async () => {
      await gptCompletion(); 
      await requestCreation();
    })();
  }, [creation, sdReady]);

  return (
    <div style={{ display: "flex", padding: "6px" }}>
      <div style={{ flex: "40%" }}>
        <h2>Record manually</h2>
        <Space>
          {recording ? (
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={stopRecording}
              disabled={sendingAudio || autoRecording}
            >
              Stop recording
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={startRecording}
              disabled={sendingAudio || autoRecording}
            >
              Start Recording
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            onClick={sendAudio}
            disabled={sendingAudio || !audioBlobRef.current || autoRecording}
          >
            Send Audio
          </Button>
          {sendingAudio ? <p>sending audio...</p> : null}
        </Space>
        <p>&nbsp;</p>
        <h3>Last:</h3>
        {lastResult}
        <p>&nbsp;</p>
        <hr />
        <h2>Record buffer automatically</h2>
        <div>
          {autoRecording ? (
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={stopAutoRecording}
              disabled={sendingAudio}
            >
              Stop
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={startAutoRecording}
              disabled={sendingAudio}
            >
              Record continuously
            </Button>
          )}
        </div>
        <p>&nbsp;</p>
        <h3>Buffer:</h3>
        <ul>
          {textBufferRef.current.map((text, index) => {
            return <li key={index}>{text}</li>;
          })}
        </ul>
        <p>&nbsp;</p>
        <h3>Prompt:</h3>
        {promptBufferRef.current}
        <p>&nbsp;</p>
        <h3>Result:</h3>
        {completionRef.current}
        <p>&nbsp;</p>
        <hr />
      </div>
      <div style={{ flex: "60%", padding: "6px" }}>
        {creation ? <ImageResult resultUrl={creation.uri} /> : null}
      </div>
    </div>
  );
};

export default Voice2Image;
