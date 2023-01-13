import MainPageContent from "components/MainPageContent";
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";
import { withSessionSsr } from "util/withSession";
// import { AuthMode } from "models/types";
import { useState } from "react";
// import { AuthContext } from "contexts/AuthContext";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    // const apiKeyToken = req.session.token ? req.session.token : "";
    const token = req.session.token
      ? req.session.token
      : "";

    return {
      props: {
        token,
      },
    };
  }
);

interface Props {
  token?: string;
}

const Home: NextPage = (props: Props) => {
  // const [selectedAuthMode, setSelectedAuthMode] = useState<
  //   AuthMode | undefined
  // >(
  //   props.token ? "ethereum" : props.apiKeyToken ? "apiKey" : undefined
  // );
  // const [availableAuthModes, setAvailableAuthModes] = useState<
  //   Record<AuthMode, boolean>
  // >({
  //   ethereum: props.ethereumToken ? true : false,
  //   apiKey: props.apiKeyToken ? true : false,
  // });
  return (
    // <AuthContext.Provider
    //   value={{
    //     selectedAuthMode,
    //     setSelectedAuthMode,
    //     availableAuthModes,
    //     setAvailableAuthModes,
    //   }}
    // >
      <div>
        <Head>
          <title>Eden Examples</title>
          <meta name="description" content="Examples for using Eden.art" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainPageContent />
      </div>
    // </AuthContext.Provider>
  );
};

export default Home;
