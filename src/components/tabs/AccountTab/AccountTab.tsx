import { Divider } from "antd";
import React from "react";

import SignIn from "components/tabs/AccountTab/SignIn";
import Balance from "components/tabs/AccountTab/Balance";
import ApiKeys from "components/tabs/AccountTab/ApiKeys";

const AccountTab = () => {
  return (
    <>
      <SignIn />
      <Divider />
      <Balance />
      <Divider />
      <ApiKeys />
    </>
  );
};

export default AccountTab;
