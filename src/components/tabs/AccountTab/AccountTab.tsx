import { Divider } from "antd";
import React from "react";

import SignIn from "components/tabs/AccountTab/SignIn";
import CreditBalance from "components/tabs/AccountTab/CreditBalance";
import ApiKeys from "components/tabs/AccountTab/ApiKeys";

const AccountTab = () => {
  return (
    <>
      <SignIn />
      <Divider />
      <CreditBalance />
      <Divider />
      <ApiKeys />
    </>
  );
};

export default AccountTab;
