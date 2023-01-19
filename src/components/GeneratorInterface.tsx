import { Button, Form } from "antd";
import axios from "axios";
import ImageResult from "components/ImageResult";
import VideoResult from "components/VideoResult";
import React, { useState } from "react";

import StringParameter from "components/parameters/StringParameter";
import OptionParameter from "components/parameters/OptionParameter";
import SliderParameter from "components/parameters/SliderParameter";

import { useGeneratorInfo } from "hooks/useGeneratorInfo";


const GeneratorInterface = ({ generatorName, isVideo }: { generatorName: string, isVideo: boolean }) => {
  const [form] = Form.useForm();
  const width = Form.useWatch("width", form);
  const height = Form.useWatch("height", form);

  const [resultUrl, setResultUrl] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const { versionId, defaultParameters } = useGeneratorInfo(generatorName);
  
  const handleGenerate = async (values: any) => {
    setGenerating(true);
    try {
      const values = form.getFieldsValue();
      const response = await axios.post("/api/generate", {
        reqConfig: values,
      });

      console.log("THE RESPONSE")
      console.log(response.data)
      console.log(response.data.outputUrl)
      setResultUrl(response.data.outputUrl);
    } catch (error: any) {
      setMessage(`Error: ${error.response.data.error.message}`);
    }
    setGenerating(false);
  };

  return (
    <div>
      <div style={{backgroundColor: "#eee", padding: 10, borderRadius: 10, marginBottom: 10, width: "90%"}}>
        <h2>/{generatorName}</h2>
        <h3 style={{color: "gray"}}>{versionId}</h3>
      </div>

      <Form
        form={form}
        name="generate"
        onFinish={handleGenerate}
      >
        {Object.keys(defaultParameters).map((key) => {
          return (
            <div key={key} style={{padding: 10, marginBottom: 10, borderBottom: "1px solid #ccc"}}>
              {defaultParameters[key].allowedValues.length > 0 ? (
                <OptionParameter form={form} key={key} parameter={defaultParameters[key]} />
              ) : (
                <>
                  {typeof defaultParameters[key].defaultValue === "number" ? (
                    <SliderParameter form={form} key={key} parameter={defaultParameters[key]} />
                  ) : (
                    <StringParameter form={form} key={key} parameter={defaultParameters[key]} />
                  )}                  
                </>
              )
            }
            </div>
          )
        })}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={generating}
            disabled={generating}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
      {message && <p>{message}</p>}
      {isVideo ? (
        <VideoResult resultUrl={resultUrl} />
      ) : (
        <ImageResult width={width} height={height} imageUrl={resultUrl} />
      )}      
    </div>
  );
};

export default GeneratorInterface;