import WalletProviderGoerli from "providers/WalletProvider/WalletProviderGoerli";
import WalletProviderMainnet from "providers/WalletProvider/WalletProviderMainnet";
import { PropsWithChildren } from "react";

const BLOCKCHAIN_ENV = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV;

const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {BLOCKCHAIN_ENV === "goerli" ? (
        <WalletProviderGoerli>{children}</WalletProviderGoerli>
      ) : (
        <WalletProviderMainnet>{children}</WalletProviderMainnet>
      )}
    </>
  );
};

export default WalletProvider;
