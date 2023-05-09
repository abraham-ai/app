import { Divider } from "antd";
import React, {useContext} from "react";
import AppContext from 'context/AppContext'

import { useAccount } from "wagmi";

import EthereumAuth from "components/account/EthereumAuth";
import MannaManage from "components/account/MannaManage";
import ApiKeys from "components/account/ApiKeys";

const AccountTab = () => {
  const { address, isConnected } = useAccount();
  const { isSignedIn, setIsSignedIn } = useContext(AppContext);

  const handleSignIn = (signedIn: boolean) => {
    setIsSignedIn(signedIn);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <>
      {isSignedIn ? (
        <div>
          <h3>Signed in as {address}</h3>
          <Divider />
          <MannaManage />
          <Divider />
          <ApiKeys />
        </div>
      ) : (
        <div>
          <p>Eden uses a signature to verify that you are the owner of this wallet.</p>
          <p>Please sign-in to get your account details.</p>
          <EthereumAuth onSignIn={handleSignIn} />
        </div>
      )}
    </>
  );
};

export default AccountTab;
