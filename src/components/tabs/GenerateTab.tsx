import { Button, Form } from "antd";
import axios from "axios";
import ImageResult from "components/ImageResult";
import { useState } from "react";

import SliderParameter from "components/parameters/SliderParameter";
import StringParameter from "components/parameters/StringParameter";
import OptionParameter from "components/parameters/OptionParameter";

interface GenerateFormInputs {
  prompt: string;
  width: number;
  height: number;
  sampler: string;
  steps: number;
}

const parameters = {
  prompt: {type: String, name: "prompt", label: "Prompt", default: "Hello World", description: "Text prompt for the creation"},
  width: {type: Number, name: "width", label: "Width", default: 512, min: 64, max: 1024, description: "Width of the creation in pixels"},
  height: {type: Number, name: "height", label: "Height", default: 512, min: 64, max: 1024, description: "Height of the creation in pixels"},
  sampler: {type: String, name: "sampler", label: "Sampler", default: "klms", options: ["klms", "euler"], description: "Sampler to use for generation (klms, euler)"},
  steps: {type: Number, name: "steps", label: "Steps", default: 50, min: 20, max: 200, description: "Number of sampling steps"},
};

const GenerateTab = () => {  
  const [form] = Form.useForm();
  const width = Form.useWatch("width", form);
  const height = Form.useWatch("height", form);
  
  const [resultUrl, setResultUrl] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async (values: GenerateFormInputs) => {
    setGenerating(true);
    try {
      const response = await axios.post("/api/generate", {
        ...values,
      });
      setResultUrl(response.data.outputUrl);
    } catch (error: any) {
      setMessage(`Error: ${error.response.data.error}`);
    }
    setGenerating(false);
  };

  return (
    <>
      <Form
        form={form}
        name="generate"
        onFinish={handleGenerate}
      >
        {Object.keys(parameters).map((key) => {
          if (parameters[key].type === Number) {
            return <SliderParameter key={key} parameter={parameters[key]} />
          } else if (parameters[key].type === String && parameters[key].options) {
            return <OptionParameter key={key}  parameter={parameters[key]} />            
          } else if (parameters[key].type === String) {
            return <StringParameter key={key} parameter={parameters[key]} />
          }
        })}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={generating}
            disabled={generating}
          >
            Generate
          </Button>
        </Form.Item>
      </Form>
      {message && <p>{message}</p>}
      <ImageResult width={width} height={height} imageUrl={resultUrl} />
    </>
  );
};

export default GenerateTab;
