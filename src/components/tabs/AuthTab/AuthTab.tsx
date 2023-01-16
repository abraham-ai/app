import CreditBalance from "components/CreditBalance";
import EthereumAuth from "components/tabs/AuthTab/EthereumAuth";

const AuthTab = () => {
  return (
    <>
      <EthereumAuth />
      <CreditBalance />
    </>
  );
};

export default AuthTab;
