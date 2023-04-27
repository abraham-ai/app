import WalletProviderGoerli from "providers/WalletProvider/WalletProviderGoerli";
import WalletProviderMainnet from "providers/WalletProvider/WalletProviderMainnet";
import { PropsWithChildren } from "react";

const BLOCKCHAIN_ENV = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV;

const WalletProvider = ({ children }: PropsWithChildren) => {
  switch (BLOCKCHAIN_ENV) {
    case "goerli":
      console.log("goerli");
      return <WalletProviderGoerli>{children}</WalletProviderGoerli>;
    case "mainnet":
      console.log("mainnet");
      return <WalletProviderMainnet>{children}</WalletProviderMainnet>;
    default:
      console.log("default");
      return <WalletProviderMainnet>{children}</WalletProviderMainnet>;
  }
};

export default WalletProvider;
