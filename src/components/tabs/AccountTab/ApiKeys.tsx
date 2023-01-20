import { Button, Table } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useApiKeys } from "hooks/useApiKeys";


const ApiKeys = () => {
  const { isConnected } = useAccount();
  const [apiKeyCreating, setApiKeyCreating] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const { apiKeys, mutate } = useApiKeys();

  const handleCreateAPIKey = async () => {
    if (!isConnected) return;
    setApiKeyCreating(true);
    try {
      await axios.post("/api/createkey");
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
      title: 'Date created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateCreated: string) => new Date(dateCreated).toLocaleString(),
    },
  ];

  return (
    <div>
      <h1>My API Keys</h1>
      <Table 
        dataSource={apiKeys?.map((apiKey, index) => ({ ...apiKey, key: apiKey._id || index }))}
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
