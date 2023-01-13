import { Button, Form, Table, InputNumber, Space } from "antd";
import axios from "axios";
import { useContext, useState } from "react";


interface MyCreationsFormInputs {
  datefrom: number;
  dateto: number;
}

const MyProfileTab = () => {
  const initialValues = {
    datefrom: "1/1/2023",
    dateto: "1/12/2023",
  };

  const [form] = Form.useForm();
  const [creations, setCreations] = useState<object[]>([]);
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async (values: MyCreationsFormInputs) => {
    setGenerating(true);
    try {
      const response = await axios.post("/api/mycreations", {
        ...values,
      });
      const data = response.data.creations &&
        response.data.creations.map((creation: any) => {
          return {
            key: creation._id,
            timestamp: creation.timestamp,
            prompt: creation.config.text_input,
            status: creation.status,
            output: creation.output,
          };
        }
      );
      setCreations(data);
    } catch (error: any) {
      setMessage(`Error: ${error.response.data.error}`);
    }
    setGenerating(false);
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      key: 'prompt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Output',
      dataIndex: 'output',
      key: 'output',
      render: (output: string) => <a href={"https://minio.aws.abraham.fun/creations-stg/"+output}>download</a>,
    },
  ];
  
  return (
    <>
      <Form
        form={form}
        name="generate"
        initialValues={initialValues}
        onFinish={handleGenerate}
      >
        <Space>
          <Form.Item label="From" name="datefrom">
            <InputNumber placeholder="Date from" />
          </Form.Item>
          <Form.Item label="To" name="dateto">
            <InputNumber placeholder="Date to" />
          </Form.Item>
        </Space>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={generating}
            disabled={generating}
          >
            Get My Creations
          </Button>
        </Form.Item>
      </Form>
      {message && <p>{message}</p>}
      <Table dataSource={creations} columns={columns} />
    </>
  );
};

export default MyProfileTab;
