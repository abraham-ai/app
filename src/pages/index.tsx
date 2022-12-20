import MainPageContent from "components/MainPageContent";
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";
import { withSessionSsr } from "util/withSession";
import { AuthMode } from "models/types";
import { useState } from "react";
import { AuthContext } from "contexts/AuthContext";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const apiKeyToken = req.session.apiKeyToken ? req.session.apiKeyToken : "";
    const ethereumToken = req.session.ethereumToken
      ? req.session.ethereumToken
      : "";

    return {
      props: {
        apiKeyToken,
        ethereumToken,
      },
    };
  }
);

interface Props {
  apiKeyToken?: string;
  ethereumToken?: string;
}

const Home: NextPage = (props: Props) => {
  const [selectedAuthMode, setSelectedAuthMode] = useState<
    AuthMode | undefined
  >(
    props.ethereumToken ? "ethereum" : props.apiKeyToken ? "apiKey" : undefined
  );
  const [availableAuthModes, setAvailableAuthModes] = useState<
    Record<AuthMode, boolean>
  >({
    ethereum: props.ethereumToken ? true : false,
    apiKey: props.apiKeyToken ? true : false,
  });
  return (
    <AuthContext.Provider
      value={{
        selectedAuthMode,
        setSelectedAuthMode,
        availableAuthModes,
        setAvailableAuthModes,
      }}
    >
      <div>
        <Head>
          <title>Eden Examples</title>
          <meta name="description" content="Examples for using Eden.art" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainPageContent />
      </div>
    </AuthContext.Provider>
  );
};

export default Home;
