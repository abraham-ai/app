import { Button, Form, Input, Select, InputNumber, Space, Row, Col, Slider } from "antd";
import axios from "axios";
import ImageResult from "components/ImageResult";
import { useContext, useEffect, useState } from "react";

import StringParameter from "components/parameters/StringParameter";
import OptionParameter from "components/parameters/OptionParameter";
import SliderParameter from "components/parameters/SliderParameter";

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




const MyForm = () => {
  
  // const initialValues = {
  //   width: 512,
  //   height: 512,
  // };

  const [form] = Form.useForm();
  
  // const [width, setWidth] = useState(initialValues.width);
  // const [height, setHeight] = useState(initialValues.height);

  const [resultUrl, setResultUrl] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // useEffect(() => {
  //   form.setFieldsValue({ width, height });
  // }, [width, height, form]);


  const handleGenerate = async (values: GenerateFormInputs) => {
    setGenerating(true);
    try {
      console.log(values);
      console.log({...values});
      console.log("gheys")
      // const response = await axios.post("/api/generate", {
      //   ...values,
      // });
      // setResultUrl(response.data.outputUrl);
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
            return <SliderParameter form={form} key={key} parameter={parameters[key]} />
          } else if (parameters[key].type === String && parameters[key].options) {
            return <OptionParameter form={form} key={key}  parameter={parameters[key]} />            
          } else if (parameters[key].type === String) {
            return <StringParameter form={form} key={key} parameter={parameters[key]} />
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
    </>
  );
};


export default MyForm;