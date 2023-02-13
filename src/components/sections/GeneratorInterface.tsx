import React, { useState } from "react";
import { Button, Form } from "antd";
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

  const [resultUrl, setResultUrl] = useState<string>("");
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
          setGenerating(false);
          return false;
        }
      }
    }
    return true;
  }

  const handleGenerate = async (values: any) => {
    setGenerating(true);
    setError(null);

    if (!validateConfig(values)) {
      setGenerating(false);
      return;
    }

    try {
      const config = getConfig(values);
      console.log("the config...")
      console.log(config);
      const response = await axios.post("/api/generate", {
        generatorName: generatorName,
        config: config,
      });
      console.log("the response...")
      console.log(response.data)
      setResultUrl(response.data.creation.uri);      
    } catch (error: any) {
      console.log("GOT THIS ERORR")
      console.log(error);
      console.log(error.response.data);
      setError(`Error: ${error.response.data.error}`);
    }

    setGenerating(false);
  };
  
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
          onFinish={handleGenerate}
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
        {error && <p style={{color: "red"}}>{error}</p>}
        {resultUrl && (
          <>
            {mediaType=="image" && <ImageResult resultUrl={resultUrl} width={width} height={height} />}
            {mediaType=="video" && <VideoResult resultUrl={resultUrl} />}
            {mediaType=="audio" && <AudioResult resultUrl={resultUrl} />}
            {mediaType=="text" && <TextResult resultUrl={resultUrl} />}
          </>
        )}
      </div>
    </div>
  );
};

export default GeneratorInterface;