import { Button, Form, Input, InputNumber, Space } from "antd";
import axios from "axios";
import VideoResult from "components/VideoResult";
// import { AuthContext } from "contexts/AuthContext";
import { useContext, useState } from "react";

interface InterpolateFormInputs {
  prompt1: string;
  prompt2: string;
  width: number;
  height: number;
  numFrames: number;
}

const InterpolateTab = () => {
  const initialValues: InterpolateFormInputs = {
    prompt1: "",
    prompt2: "",
    width: 512,
    height: 512,
    numFrames: 30,
  };

  // const { selectedAuthMode } = useContext(AuthContext);

  const [resultUrl, setResultUrl] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInterpolate = async (values: InterpolateFormInputs) => {
    setGenerating(true);
    try {
      const response = await axios.post("/api/interpolate", {
        ...values,
        // authMode: selectedAuthMode,
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
        name="interpolate"
        initialValues={initialValues}
        onFinish={handleInterpolate}
      >
        <Form.Item label="Prompt 1" name="prompt1">
          <Input />
        </Form.Item>
        <Form.Item label="Prompt 2" name="prompt2">
          <Input />
        </Form.Item>
        <Space>
          <Form.Item label="Width" name="width">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Height" name="height">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Number of Frames" name="numFrames">
            <InputNumber min={0} />
          </Form.Item>
        </Space>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={generating}
            disabled={generating}
          >
            Interpolate
          </Button>
        </Form.Item>
      </Form>
      {message && <p>{message}</p>}
      <VideoResult resultUrl={resultUrl} />
    </>
  );
};

export default InterpolateTab;
