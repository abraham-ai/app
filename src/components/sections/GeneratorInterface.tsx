import React, { useState, useEffect } from "react";
import { Button, Form, Progress } from "antd";
import { RightCircleOutlined, UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';
import axios from "axios";

import { useGeneratorInfo } from "hooks/useGeneratorInfo";

import ImageResult from "components/media/ImageResult";
import VideoResult from "components/media/VideoResult";
import AudioResult from "components/media/AudioResult";
import TextResult from "components/media/TextResult";

import UploadParameter from "components/parameters/UploadParameter";
import StringParameter from "components/parameters/StringParameter";
import OptionParameter from "components/parameters/OptionParameter";
import SliderParameter from "components/parameters/SliderParameter";


const GeneratorInterface = ({ generatorName, mediaType }: { generatorName: string, mediaType: string }) => {
  const [form] = Form.useForm();
  const width = Form.useWatch("width", form);
  const height = Form.useWatch("height", form);

  const [values, setValues] = useState({});
  const [progress, setProgress] = useState<number>(0);
  const [taskId, setTaskId] = useState<string>("");
  const [creation, setCreation] = useState<any>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState<boolean>(false);
  const {versionId, requiredParameters, optionalParameters} = useGeneratorInfo(generatorName);

  const allParameters = [...requiredParameters, ...optionalParameters];
  
  const getConfig = (config: any) => {
    Object.keys(requiredParameters).forEach((key) => {
      const name = requiredParameters[key].name;
      if (config[name] === undefined) {
        config[name] = requiredParameters[key].default;
      }
    });
    Object.keys(optionalParameters).forEach((key) => {
      const name = optionalParameters[key].name;
      if (config[name] === undefined) {
        config[name] = optionalParameters[key].default;
      }
    });
    return config;
  }

  const validateConfig = (values: any) => {
    for (const v in values) {
      if (!values[v]) {
        continue;
      }
      const param = allParameters.find((parameter: any) => parameter.name === v);
      if (param.minLength) {
        if (values[v].length < param.minLength) {
          setError(`Error: ${v} must have at least ${param.minLength} elements`);
          return false;
        }
      }
      if (param.maxLength) {
        if (values[v].length >= param.maxLength) {
          setError(`Error: ${v} must have no more than ${param.maxLength} elements`);
          return false;
        }
      }
    }
    return true;
  }

  const pollForResult = async (taskId: string, pollingInterval: number = 2000) => {
    let response = await axios.post("/api/fetch", {taskId: taskId});
    let task = response.data.task;

    while (
      task.status == "pending" ||
      task.status == "starting" ||
      task.status == "running"
    ) {
      await new Promise((r) => setTimeout(r, pollingInterval));
      response = await axios.post("/api/fetch", {taskId: taskId});
      task = response.data.task;
      setProgress(Math.floor(100*task.progress));
    }

    if (task.status == "failed") {
      throw new Error(task.error.message);
    } else if (!response.data.creation) {
      throw new Error("No creation found");
    };

    return response.data.creation;
  };

  const handleFinish = (formValues: any) => {
    setValues(formValues);
  };

  useEffect(() => {
    const requestCreation = async (values: any) => {
    
      setGenerating(true);
      setError(null);

      if (!validateConfig(values)) {
        setGenerating(false);
        return;
      }

      try {
        const config = getConfig(values);
        const response = await axios.post("/api/generate", {
          generatorName: generatorName,
          config: config,
        });
        const newTaskId = response.data.taskId;
        setTaskId(newTaskId);
        const creation = await pollForResult(newTaskId);
        setCreation(creation);
      } 
      catch (error: any) {
        console.log("THIS IS THE RROR")
        console.log(error)
        if (error.message) {
          setError(`Error: ${error.message}`);
        } else {
          setError(`Error: ${error.response.data.error}`);
        }
      }

      setGenerating(false);
    };

    if (Object.keys(values).length > 0) {
      requestCreation(values);
    }

  }, [values]);
  
  const renderFormFields = (parameters: any) => {
    return Object.keys(parameters).map((key) => {
      return (
        <div key={key} style={{paddingBottom: 5, marginBottom: 10, borderBottom: "1px solid #ccc"}}>
          {parameters[key].allowedValues.length > 0 ? (
            <OptionParameter key={key} form={form} parameter={parameters[key]} />
          ) : (
            <>
              {typeof parameters[key].default === "number" ? (
                <SliderParameter key={key} form={form} parameter={parameters[key]} />
              ) : (
                <>
                  {parameters[key].mediaUpload ? (
                    <UploadParameter key={key} form={form} parameter={parameters[key]} />
                  ) : (
                    <StringParameter key={key} form={form} parameter={parameters[key]} />
                  )}
                </>
              )}                  
            </>
          )}
        </div>
      )
    });
  };
  
  return (
    <div>
      
      <div style={{backgroundColor: "#eee", padding: 10, borderRadius: 10, marginBottom: 10, width: "90%"}}>
        <h2>/{generatorName}</h2>
        <h3>version: <span style={{color: "gray"}}>{versionId}</span></h3>
      </div>

      <div style={{padding:10}}>
        <Form
          form={form}
          name="generate"
          onFinish={handleFinish}
        >
          {renderFormFields(requiredParameters)}
          <h3 style={{padding: 5}}>
            {optionalParameters.length > 0 && (
              <>
              {showOptional ? (
                <Button onClick={() => setShowOptional(false)}><UpCircleOutlined/>Hide optional settings</Button>
              ) : (
                <Button onClick={() => setShowOptional(true)}><DownCircleOutlined/>Show optional settings</Button>
              )}
              </>
            )}
          </h3>
          {showOptional && renderFormFields(optionalParameters)}
          <Form.Item>
            <Button
              type="primary"
              icon={<RightCircleOutlined />} 
              htmlType="submit"
              loading={generating}
              disabled={generating}
              size="large"
            >
              Create
            </Button>
          </Form.Item>
        </Form>

        <div id="result" style={{display: "flex", flexDirection: "row"}}>
          <div id="resultLeft" style={{flexBasis: "auto", flexGrow: 0, padding: 10}}>
            {creation && creation.uri && (
              <>
                {mediaType=="image" && <ImageResult resultUrl={creation.uri} width={width} height={height} />}
                {mediaType=="video" && <VideoResult resultUrl={creation.uri} />}
                {mediaType=="audio" && <AudioResult resultUrl={creation.uri} />}
                {mediaType=="text" && <TextResult resultUrl={creation.uri} />}
              </>
            )}
          </div>
          <div id="resultRight" style={{flexBasis: "auto", flexGrow: 1, padding: 10}}>
            {generating && <>
              {taskId && <h3>Task Id: {taskId}</h3>}
              <Progress style={{width: "25%"}} percent={progress} />
            </>}
            {error && <p style={{color: "red"}}>{error}</p>}
            {creation && creation.attributes && Object.keys(creation.attributes).length > 0 && (
              <>
                <h3>Attributes</h3>
                <ul>
                  {Object.keys(creation.attributes).map((key) => {
                    return (
                      <li key={key}>
                        <b>{key}</b>:&nbsp;:&nbsp;
                        {Array.isArray(creation.attributes[key]) ? (
                          <ul>
                            {creation.attributes[key].map((item: any) => {
                              return <li key={item}>{item}<br/></li>;
                            })}
                          </ul>
                        ) : (
                          <>{creation.attributes[key]}</>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorInterface;