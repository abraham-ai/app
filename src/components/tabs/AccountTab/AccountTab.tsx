import { Divider } from "antd";
import React from "react";

import EthereumAuth from "components/tabs/AccountTab/EthereumAuth";
import CreditBalance from "components/tabs/AccountTab/CreditBalance";
import ApiKeys from "components/tabs/AccountTab/ApiKeys";

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
