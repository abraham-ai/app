import { Divider } from "antd";
import React from "react";

import EthereumAuth from "components/sections/Account/EthereumAuth";
import MannaBalance from "components/sections/Account/MannaBalance";
import ApiKeys from "components/sections/Account/ApiKeys";

const AccountTab = () => {
  return (
    <>
      <EthereumAuth />
      <Divider />
      <MannaBalance />
      <Divider />
      <ApiKeys />
    </>
  );
};

export default AccountTab;
