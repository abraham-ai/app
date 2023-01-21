import React, { useState } from "react";
import { Button, Form } from "antd";
import { RightCircleOutlined, UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';
import axios from "axios";

import { useGeneratorInfo } from "hooks/useGeneratorInfo";

import ImageResult from "components/ImageResult";
import VideoResult from "components/VideoResult";
import UploadParameter from "components/parameters/UploadParameter";
import StringParameter from "components/parameters/StringParameter";
import OptionParameter from "components/parameters/OptionParameter";
import SliderParameter from "components/parameters/SliderParameter";


const GeneratorInterface = ({ generatorName, isVideo }: { generatorName: string, isVideo: boolean }) => {
  const [form] = Form.useForm();
  const width = Form.useWatch("width", form);
  const height = Form.useWatch("height", form);

  const [resultUrl, setResultUrl] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState<boolean>(false);
  const {versionId, requiredParameters, optionalParameters} = useGeneratorInfo(generatorName);
  
  const getConfig = (config: any) => {
    Object.keys(requiredParameters).forEach((key) => {
      const name = requiredParameters[key].name;
      if (config[name] === undefined) {
        config[name] = requiredParameters[key].defaultValue;
      }
    });
    Object.keys(optionalParameters).forEach((key) => {
      const name = optionalParameters[key].name;
      if (config[name] === undefined) {
        config[name] = optionalParameters[key].defaultValue;
      }
    });
    return config;
  }

  const handleGenerate = async (values: any) => {
    setGenerating(true);
    setMessage(null);
    try {
      const config = getConfig(values);
      const response = await axios.post("/api/generate", {
        generatorName: generatorName,
        reqConfig: config,
      });  
      setResultUrl(response.data.outputUrl);      
    } catch (error: any) {
      setMessage(`Error: ${error.response.data.error}`);
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
              {typeof parameters[key].defaultValue === "number" ? (
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
        <h3 style={{color: "gray"}}>{versionId}</h3>
      </div>

      <div style={{padding:10}}>
        <Form
          form={form}
          name="generate"
          onFinish={handleGenerate}
        >
          {renderFormFields(requiredParameters)}
          <h3 style={{padding: 5}}>
            {showOptional ? (
              <Button onClick={() => setShowOptional(false)}><UpCircleOutlined/>Hide optional settings</Button>
            ) : (
              <Button onClick={() => setShowOptional(true)}><DownCircleOutlined/>Show optional settings</Button>
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
        {message && <p>{message}</p>}
        {resultUrl && (
          <>
            {isVideo ? (
              <VideoResult resultUrl={resultUrl} />
            ) : (
              <ImageResult width={width} height={height} imageUrl={resultUrl} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GeneratorInterface;