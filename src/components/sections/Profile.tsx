import { Modal, Form, Table, Switch } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
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
  
  const [create, setCreate] = useState<boolean>(false);
  const [remix, setRemix] = useState<boolean>(false);
  const [interpolate, setInterpolate] = useState<boolean>(false);
  const [real2real, setReal2Real] = useState<boolean>(false);
  const [tts, setTts] = useState<boolean>(false);
  const [wav2lip, setWav2Lip] = useState<boolean>(false);
  const [interrogate, setInterrogate] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  

  useEffect(() => {
    const fetchCreations = async () => {
      if (!profile || !profile.username) {
        return;
      }
      setLoading(true);
      try {
        const selectedGenerators = Object.entries({ create, remix, interpolate, real2real, tts, wav2lip, interrogate, complete }).filter(([key, value]) => value).map(([key, value]) => key);

        const filter = {username: profile.username, generators: selectedGenerators};
        
        const response = await axios.post("/api/creations", filter);
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
  }, [profile, create, remix, interpolate, real2real, tts, wav2lip, interrogate, complete]);

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

      <Switch checked={create} checkedChildren="Create" unCheckedChildren="Create" defaultChecked onChange={(checked) => setCreate(checked)} />
      <Switch checked={remix} onChange={(checked) => setRemix(checked)} />
      <Switch checked={interpolate} onChange={(checked) => setInterpolate(checked)} />
      <Switch checked={real2real} onChange={(checked) => setReal2Real(checked)} />
      <Switch checked={tts} onChange={(checked) => setTts(checked)} />
      <Switch checked={wav2lip} onChange={(checked) => setWav2Lip(checked)} />
      <Switch checked={interrogate} onChange={(checked) => setInterrogate(checked)} />
      <Switch checked={complete} onChange={(checked) => setComplete(checked)} />

      {message && <p>{message}</p>}
      {loading ? <p>Loading...</p> : <>
        <Table dataSource={creations} columns={columns} />
      </>}
    </>
  );
};

export default Profile;