import { Button, Table } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useAccount } from "wagmi";

const ApiKeys = () => {
  const { address, isConnected } = useAccount();
  const [apiKeyCreating, setApiKeyCreating] = useState(false);
  const [apiKeys, setApiKeys] = useState<object[]>([]);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const handleCreateAPIKey = async () => {
    if (!isConnected) return;
    setApiKeyCreating(true);
    try {
      const response = await axios.post("/api/keys", {});
      // const data = response.data.creations &&
      //   response.data.creations.map((creation: any) => {
      //     return {
      //       key: creation._id,
      //       timestamp: creation.timestamp,
      //       prompt: creation.config.text_input,
      //       status: creation.status,
      //       output: creation.output,
      //     };
      //   }
      // );
      // setApiKeys(data);
    } catch (error: any) {
      setApiMessage(`Error: ${error.response.data.error}`);
      setApiKeyCreating(false);
    }
  };

  const columns = [
    {
      title: 'API Key',
      dataIndex: 'apiKey',
      key: 'apiKey'
    },
    {
      title: 'Date created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: (dateCreated: number) => new Date(dateCreated).toLocaleString(),
    },
  ];

  return (
    <div>
      <h1>My API Keys</h1>
      <Table dataSource={apiKeys} columns={columns} />
      <Button
        type="primary"
        onClick={handleCreateAPIKey}
        disabled={apiKeyCreating}
        loading={apiKeyCreating}
      >
        Create new API key
      </Button>
      {apiMessage && <p>{apiMessage}</p>}
    </div>
  );
};

export default ApiKeys;
