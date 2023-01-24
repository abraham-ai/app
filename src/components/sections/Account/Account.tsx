import { Divider } from "antd";
import React from "react";

import EthereumAuth from "components/sections/Account/EthereumAuth";
import CreditBalance from "components/sections/Account/CreditBalance";
import ApiKeys from "components/sections/Account/ApiKeys";

const AccountTab = () => {
  return (
    <>
      <EthereumAuth />
      <Divider />
      <CreditBalance />
      <Divider />
      <ApiKeys />
    </>
  );
};

export default AccountTab;
