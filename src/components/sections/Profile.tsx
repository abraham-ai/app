import { Modal, Button, Form, Table, DatePicker, Space } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import type { DatePickerProps } from 'antd';
import { useProfile } from "hooks/useProfile";
import ImageResult from "components/media/ImageResult";


const Profile = () => {

  const [form] = Form.useForm();
  const [creations, setCreations] = useState<object[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const {profile} = useProfile();
  
  const [configVisible, setConfigVisible] = useState<boolean>(false);
  const [resultVisible, setResultVisible] = useState<boolean>(false);
  const [config, setConfig] = useState<object>({});
  const [result, setResult] = useState<string>("");
  
  useEffect(() => {
    const fetchCreations = async () => {
      if (!profile || !profile.username) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post("/api/creations", {
          username: profile.username
        });
        const data = response.data.creations &&
          response.data.creations.map((creation: any) => {
            return {
              key: creation._id,
              timestamp: creation.createdAt,
              name: creation.name,
              status: creation.task.status,
              output: creation.uri,
              config: creation.task.config,
            };
          }
        );
        setCreations(data);
      } catch (error: any) {
        setMessage(`Error: ${error}`);
      }
      setLoading(false);
    };
    fetchCreations();
  }, [profile]);

  const handleConfigClick = (creation: any) => {
    setConfig(creation.config);
    setConfigVisible(true);
  };

  const handleConfigModalOk = () => {
    setConfigVisible(false);
  };

  const handleConfigModalCancel = () => {
    setConfigVisible(false);
  };

  const handleResultClick = (url: any) => {
    setResult(url);
    setResultVisible(true);
  };

  const handleResultModalOk = () => {
    setResultVisible(false);
  };

  const handleResultModalCancel = () => {
    setResultVisible(false);
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
      render: (output: string) => (
        <a onClick={() => handleResultClick(output)}>output</a>
      )
    },
    {
      title: "Config",
      key: "config",
      render: (creation: any) => (
        <a onClick={() => handleConfigClick(creation)}>config</a>
      ),
    },
  ];
  
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    // console.log(date, dateString);
  };
  
  return (    
    <>
      <Modal
        title="Configuration"
        open={configVisible}
        onOk={handleConfigModalOk}
        onCancel={handleConfigModalCancel}
      >
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </Modal>

      <Modal
        title="Result"
        open={resultVisible}
        onOk={handleResultModalOk}
        onCancel={handleResultModalCancel}
      >
        <ImageResult resultUrl={result} />
      </Modal>

      {message && <p>{message}</p>}
      {loading ? <p>Loading...</p> : <>
        <Table dataSource={creations} columns={columns} />
      </>}
    </>
  );
};

export default Profile;