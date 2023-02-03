import { Button, Table } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useApiKeys } from "hooks/useApiKeys";


const ApiKeys = () => {
  const { isConnected } = useAccount();
  const [apiKeyCreating, setApiKeyCreating] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const { apiKeys, error, mutate } = useApiKeys();

  const handleCreateAPIKey = async () => {
    if (!isConnected) return;
    setApiKeyCreating(true);
    try {
      await axios.post("/api/createkey", {
        "note": "test"
      });
      setApiKeyCreating(false);
      mutate();
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
      title: 'API Secret',
      dataIndex: 'apiSecret',
      key: 'apiSecret'
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note'
    },
    {
      title: 'Date created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateCreated: string) => new Date(dateCreated).toLocaleString(),
    },
  ];

  const data = apiKeys?.map(
    (apiKey: any, index: any) => ({ ...apiKey, key: apiKey._id || index })
  );

  return (
    <div>
      {error && <p style={{color: "red"}}>{error}</p>}
      <h1>My API Keys</h1>
      <Table 
        dataSource={data}
        columns={columns} 
      />
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
