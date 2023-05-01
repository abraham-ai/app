import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Progress, Switch, Modal } from "antd";
import { RightCircleOutlined, UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';
import axios from "axios";

import { useGeneratorInfo } from "hooks/useGeneratorInfo";
import { useLoras } from "hooks/useLoras";
import { useMannaBalance } from "hooks/useMannaBalance";

import AppContext from 'context/AppContext'
import { GeneratorState } from "context/AppContext";

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
  const [allLoras, setAllLoras] = useState<boolean>(false);
  const {generators, setGenerators, username} = useContext(AppContext);
  const {manna, mutate: updateManna} = useMannaBalance();
  const [updatedManna, setUpdatedManna] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (updatedManna !== null && manna === 0) {
      setUpdatedManna(true);
      setIsModalVisible(true);
    } else {
      setUpdatedManna(false);
    }
  }, [manna]);

  const {
    progress = 0,
    taskId = "",
    creation = null,
    generating = false,
  } = generators[generatorName] ?? {};

  const [error, setError] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState<boolean>(false);
    
  const userFilter = allLoras ? '' : username ?? '';
  const {loras} = useLoras(userFilter);
    
  const { description, requiredParameters, optionalParameters } = useGeneratorInfo(generatorName);

  const allParameters = [...requiredParameters, ...optionalParameters];

  // put Loras into the list of allowed values for the lora parameter
  if (loras) {
    allParameters.forEach((parameter: any) => {
      if (parameter.name === "lora") {
        parameter.allowedValues = [
          "(none)",
          ...loras.map((lora: any) => lora.name)
        ];
      }
    });
  }

  const setGenerator = (key: string, value: any) => {
    setGenerators((prevGenerators: Record<string, GeneratorState>) => ({
      ...prevGenerators,
      [generatorName]: {
        ...prevGenerators[generatorName],
        [key]: value,
      },
    }));
  };

  const setProgress = (newProgress: number) => {
    setGenerator("progress", newProgress);
  };

  const setTaskId = (newTaskId: string) => {
    setGenerator("taskId", newTaskId);
  };

  const setCreation = (newCreation: any) => {
    setGenerator("creation", newCreation);
  };

  const setGenerating = (newGenerating: boolean) => {
    setGenerator("generating", newGenerating);
  };

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
        if (values[v].length > param.maxLength) {
          setError(`Error: ${v} must have no more than ${param.maxLength} elements`);
          return false;
        }
      }
    }
    return true;
  }

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
      setProgress(Math.floor(100 * task.progress));
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
        updateManna();
        const creation = await pollForResult(newTaskId);
        setCreation(creation);
        updateManna();
      }
      catch (error: any) {
        setError(`Error: ${error.response.data.error}`);
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
        <div key={key} style={{ paddingBottom: 5, marginBottom: 10, borderBottom: "1px solid #ccc" }}>
          {(parameters[key].allowedValues.length > 0 || parameters[key].allowedValuesFrom) ? (
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
          {parameters[key].name == "lora" && (
            <>
              <Switch checked={allLoras} onChange={setAllLoras} />
              &nbsp;&nbsp;Include all Loras
            </>
          )}
        </div>
      )
    });
  };

  return (
    <div>
      <Modal
        title="You are out of Manna"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        okText="Amen"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        To get more Manna, come to the next Miracle. See <a href="https://discord.gg/4dSYwDT"><u>Discord</u></a> for details.
      </Modal>
      <div style={{ backgroundColor: "#eee", padding: 10, borderRadius: 10, marginBottom: 10, width: "90%" }}>
        <h2>/{generatorName}</h2>
        <h3><span style={{ color: "gray" }}>{description}</span></h3>
      </div>

      <div style={{ padding: 10 }}>
        <Form
          form={form}
          name="generate"
          onFinish={handleFinish}
        >
          {renderFormFields(requiredParameters)}
          <h3 style={{ padding: 5 }}>
            {optionalParameters.length > 0 && (
              <>
                {showOptional ? (
                  <Button onClick={() => setShowOptional(false)}><UpCircleOutlined />Hide optional settings</Button>
                ) : (
                  <Button onClick={() => setShowOptional(true)}><DownCircleOutlined />Show optional settings</Button>
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

        <div id="result" style={{ display: "flex", flexDirection: "row" }}>
          <div id="resultLeft" style={{ flexBasis: "auto", flexGrow: 0, padding: 10 }}>
            {creation && creation.uri && (
              <>
                {mediaType == "image" && <ImageResult resultUrl={creation.uri} />}
                {mediaType == "video" && <VideoResult resultUrl={creation.uri} />}
                {mediaType == "audio" && <AudioResult resultUrl={creation.uri} />}
                {mediaType == "text" && <TextResult resultUrl={creation.uri} />}
              </>
            )}
          </div>
          <div id="resultRight" style={{ flexBasis: "auto", flexGrow: 1, padding: 10 }}>
            {generating && <>
              {taskId && <p><h3>Task Id: {taskId}</h3></p>}
              {mediaType == "video" && <p><Progress style={{ width: "25%" }} percent={progress} /></p>}
              <p><h4>{mediaType == "lora" ? "Training" : "Generating"}... it is safe to close this page.</h4></p>
              {mediaType == "lora" && <p><h5 style={{color: "gray"}}>Note: no result is returned to this screen for LORA training. When training is done (~20 minutes from now), the LORA will become available in the other generators.</h5></p>}
            </>}
            {error && <p style={{ color: "red" }}>{error}</p>}
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
                              return <li key={item}>{item}<br /></li>;
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