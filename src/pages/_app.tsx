import React, { useState, useContext } from "react";
import type { AppProps } from "next/app";
import { GeneratorState } from "context/AppContext";
import AppContext from "context/AppContext";
import "styles/globals.css";
import WalletProvider from "providers/WalletProvider";
import WalletProviderGoerli from "providers/WalletProvider/WalletProviderGoerli";

function App({ Component, pageProps }: AppProps) {
  const [generators, setGenerators] = useState<Record<string, GeneratorState>>(
    {}
  );
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        username,
        setUsername,
        generators,
        setGenerators,
      }}
    >
      <WalletProviderGoerli>
        <Component {...pageProps} />
      </WalletProviderGoerli>
    </AppContext.Provider>
  );
}

export default App;
