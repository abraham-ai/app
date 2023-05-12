import { Button } from "antd";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import AppContext from "context/AppContext";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";


type EthereumAuthProps = {
  onSignIn: (signedIn: boolean) => void;
  isButton: boolean; 
}

const EthereumAuth = ({ onSignIn, isButton }: EthereumAuthProps) => {
  const { setIsNewUser, setIsSignedIn } = useContext(AppContext);
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const [ethAuthenticating, setEthAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  

  const { signMessage } = useSignMessage({
    onSuccess: async (data, variables) => {
      try {
        const result = await axios.post("/api/login", {
          message: variables.message,
          signature: data,
          address: address,
        });
        if (result.data.newUser) {
          setIsNewUser(true);
        }
        onSignIn(true);
      } catch (error: any) {
        setErrorMessage("Error authenticating");
        onSignIn(false);
      }      
      setEthAuthenticating(false);
    },
  });

  const handleSiwe = async () => {
    if (!isConnected) return;
    setEthAuthenticating(true);
    try {
      const nonce = await fetch('/api/nonce');
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to Eden with Ethereum.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await nonce.text(),
      });
      const preparedMessage = message.prepareMessage();
      await signMessage({
        message: preparedMessage,
      });
    } catch (error: any) {
      setErrorMessage("Error authenticating");
      setEthAuthenticating(false);
    }
  };

  // const handleSignOut = async () => {
  //   const result = await axios.post("/api/logout");
  //   setIsSignedIn(false);
  // };

  return (
    <div>
      {isConnected && (
        <>
          {isButton ? (
            <Button
              type="primary"
              onClick={handleSiwe}
              disabled={ethAuthenticating}
              loading={ethAuthenticating}
            >
              Sign In
            </Button>
          ) : (
            <span style={{fontSize: "0.9em"}}>
              <a href="#" onClick={handleSiwe}>
                [Sign In Again]
              </a>
            </span>
          )}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </>
      )}
    </div>
  );

};

export default EthereumAuth;