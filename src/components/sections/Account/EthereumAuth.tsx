import { Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";

type EthereumAuthProps = {
  onSignIn: (signedIn: boolean) => void; // Specify the type of the onSignIn prop
}

const EthereumAuth = ({ onSignIn }: EthereumAuthProps) => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const [ethAuthenticating, setEthAuthenticating] = useState(false);
  const [ethMessage, setEthMessage] = useState<string | null>(null);

  const { signMessage } = useSignMessage({
    onSuccess: async (data, variables) => {
      try {
        await axios.post("/api/login", {
          message: variables.message,
          signature: data,
          userAddress: address,
        });
        setEthMessage("Successfully authenticated as " + address);
        onSignIn(true);
      } catch (error: any) {
        setEthMessage("Error authenticating");
        onSignIn(false);
      }
      setEthAuthenticating(false);
    },
  });

  const handleSiwe = async () => {
    if (!isConnected) return;
    setEthAuthenticating(true);
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: Date.now().toString(),
      });
      const preparedMessage = message.prepareMessage();
      await signMessage({
        message: preparedMessage,
      });
    } catch (error: any) {
      setEthMessage("Error authenticating");
      setEthAuthenticating(false);
    }
  };

  return (
    <div>
      {isConnected && (
        <>
          <h1>Sign in with Ethereum</h1>
          <Button
            type="primary"
            onClick={handleSiwe}
            disabled={ethAuthenticating}
            loading={ethAuthenticating}
          >
            Sign In
          </Button>
          {ethMessage && <p>{ethMessage}</p>}
        </>
      )}
    </div>
  );
};

export default EthereumAuth;