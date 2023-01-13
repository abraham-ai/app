import { Button } from "antd";
import axios from "axios";
// import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";

const EthereumAuth = () => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  // const { setSelectedAuthMode, availableAuthModes, setAvailableAuthModes } =
  //   useContext(AuthContext);

  const [ethAuthenticating, setEthAuthenticating] = useState(false);
  const [ethMessage, setEthMessage] = useState<string | null>(null);

  const { signMessage } = useSignMessage({
    onSuccess: async (data, variables) => {
      try {
        await axios.post("/api/auth/wallet", {
          message: variables.message,
          signature: data,
          userAddress: address,
        });
        setEthMessage("Successfully authenticated as " + address);
        // setAvailableAuthModes({
        //   ...availableAuthModes,
        //   ethereum: true,
        // });
        // setSelectedAuthMode("ethereum");
      } catch (error: any) {
        setEthMessage("Error authenticating");
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
    </div>
  );
};

export default EthereumAuth;
