import { Divider } from "antd";
import React, {useState} from "react";

import EthereumAuth from "components/sections/Account/EthereumAuth";
import MannaBalance from "components/sections/Account/MannaBalance";
import ApiKeys from "components/sections/Account/ApiKeys";

const AccountTab = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); 
  
  const handleSignIn = (signedIn: boolean) => {
    setIsSignedIn(signedIn);
  };

  return (
    <>
      <EthereumAuth onSignIn={handleSignIn} />
      {isSignedIn && (
        <>
          <Divider />
          <MannaBalance />
        </>
      )}
      {isSignedIn && (
        <>
          <Divider />
          <ApiKeys />
        </>
      )}
    </>
  );
};

export default AccountTab;
