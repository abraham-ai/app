import { Divider } from "antd";
import React, {useContext} from "react";
import AppContext from 'context/AppContext'

import { useAccount } from "wagmi";

import EthereumAuth from "components/sections/Account/EthereumAuth";
import MannaBalance from "components/sections/Account/MannaBalance";
import ApiKeys from "components/sections/Account/ApiKeys";

const AccountTab = () => {
  const { address, isConnected } = useAccount();
  const { isSignedIn, setIsSignedIn } = useContext(AppContext);

  const handleSignIn = (signedIn: boolean) => {
    setIsSignedIn(signedIn);
  };

  return (
    <>
      {isConnected && isSignedIn && (
        <h3>Signed in as {address}</h3>
      )}
      {isConnected && (
        <EthereumAuth onSignIn={handleSignIn} />
      )}
      {isConnected && isSignedIn && (
        <>
          <Divider />
          <MannaBalance />
          <Divider />
          <ApiKeys />
        </>
      )}
    </>
  );
};

export default AccountTab;
