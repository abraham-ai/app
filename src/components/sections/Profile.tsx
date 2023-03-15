import { Modal, Table, Switch, Space } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { useProfile } from "hooks/useProfile";
import ImageResult from "components/media/ImageResult";
import VideoResult from "components/media/VideoResult";
import TextResult from "components/media/TextResult";
import AudioResult from "components/media/AudioResult";

const Profile = () => {

  const [creations, setCreations] = useState<object[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const {profile} = useProfile();
  
  const [configVisible, setConfigVisible] = useState<boolean>(false);
  const [resultVisible, setResultVisible] = useState<boolean>(false);
  const [config, setConfig] = useState<object>({});
  const [result, setResult] = useState<string>("");
  const [outputType, setOutputType] = useState<string>("image");
  
  const [create, setCreate] = useState<boolean>(false);
  const [remix, setRemix] = useState<boolean>(false);
  const [interpolate, setInterpolate] = useState<boolean>(false);
  const [real2real, setReal2Real] = useState<boolean>(false);
  const [tts, setTts] = useState<boolean>(false);
  const [tts_fast, setTts_fast] = useState<boolean>(false);
  const [wav2lip, setWav2Lip] = useState<boolean>(false);
  const [interrogate, setInterrogate] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  

  const getOutputType = (generatorName: string) => {
    if (generatorName == "tts" || generatorName == "tts_fast") {
      return "audio";
    } else if (generatorName == "interrogate") {
      return "text";
    } else if (generatorName == "wav2lip" || generatorName == "interpolate" || generatorName == "real2real") {
      return "video";
    } else {
      return "image";
    }
  }

  useEffect(() => {
    const fetchCreations = async () => {
      if (!profile || !profile.username) {
        return;
      }
      setLoading(true);
      try {
        const generatorsFilter = { create, remix, interpolate, real2real, tts, tts_fast, wav2lip, interrogate, complete };
        const selectedGenerators = Object.entries(generatorsFilter).filter(([key, value]) => value).map(([key, value]) => key);
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
              outputType: getOutputType(creation.task?.generator?.generatorName),
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

  const handleResultClick = (url: any, outputType: string) => {
    setOutputType(outputType);
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
      render: (output: string, record: any) => (
        <a onClick={() => handleResultClick(output, record.outputType)}>output</a>
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
        footer={null}
      >
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </Modal>

      <Modal
        title="Result"
        open={resultVisible}
        onOk={handleResultModalOk}
        onCancel={handleResultModalCancel}
        footer={null}
      >
        {outputType == "image" && <ImageResult resultUrl={result} />}
        {outputType == "video" && <VideoResult resultUrl={result} />}
        {outputType == "audio" && <AudioResult resultUrl={result} />}
        {outputType == "text" && <TextResult resultUrl={result} />}
      </Modal>

      <Space>
        <Switch checked={create} checkedChildren="Create" unCheckedChildren="Create" defaultChecked onChange={(checked) => setCreate(checked)} />
        <Switch checked={remix} checkedChildren="Remix" unCheckedChildren="Remix" onChange={(checked) => setRemix(checked)} />
        <Switch checked={interpolate} checkedChildren="Interpolate" unCheckedChildren="Interpolate" onChange={(checked) => setInterpolate(checked)} />
        <Switch checked={real2real} checkedChildren="Real2real" unCheckedChildren="Real2real" onChange={(checked) => setReal2Real(checked)} />
        <Switch checked={tts} checkedChildren="TTS" unCheckedChildren="TTS" onChange={(checked) => setTts(checked)} />
        <Switch checked={tts_fast} checkedChildren="TTS (PlayHT)" unCheckedChildren="TTS (PlayHT)" onChange={(checked) => setTts_fast(checked)} />
        <Switch checked={wav2lip} checkedChildren="Wav2Lip" unCheckedChildren="Wav2Lip" onChange={(checked) => setWav2Lip(checked)} />
        <Switch checked={interrogate} checkedChildren="Interrogate" unCheckedChildren="Interrogate" onChange={(checked) => setInterrogate(checked)} />
        <Switch checked={complete} checkedChildren="Complete" unCheckedChildren="Complete" onChange={(checked) => setComplete(checked)} />
      </Space>

      {message && <p>{message}</p>}
      {loading ? <p>Loading...</p> : <>
        <Table dataSource={creations} columns={columns} />
      </>}
    </>
  );
};

export default Profile;