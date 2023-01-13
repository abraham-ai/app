import { Button, Form, Input, InputNumber, Space } from "antd";
import axios from "axios";
import VideoResult from "components/VideoResult";
// import { AuthContext } from "contexts/AuthContext";
import { useContext, useState } from "react";

interface Real2RealFormInputs {
  initImageUrl1: string;
  initImageUrl2: string;
  width: number;
  height: number;
  numFrames: number;
}

const Real2RealTab = () => {
  const initialValues: Real2RealFormInputs = {
    initImageUrl1: "",
    initImageUrl2: "",
    width: 512,
    height: 512,
    numFrames: 30,
  };

  // const { selectedAuthMode } = useContext(AuthContext);

  const [resultUrl, setResultUrl] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReal2Real = async (values: Real2RealFormInputs) => {
    setGenerating(true);
    try {
      const response = await axios.post("/api/real2real", {
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
        name="Real2Real"
        initialValues={initialValues}
        onFinish={handleReal2Real}
      >
        <Form.Item label="Init Image URL 1" name="initImageUrl1">
          <Input />
        </Form.Item>
        <Form.Item label="Init Image URL 2" name="initImageUrl2">
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
            Generate Real2Real
          </Button>
        </Form.Item>
      </Form>
      {message && <p>{message}</p>}
      <VideoResult resultUrl={resultUrl} />
    </>
  );
};

export default Real2RealTab;
