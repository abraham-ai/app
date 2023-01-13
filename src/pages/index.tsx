import MainPageContent from "components/MainPageContent";
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";
import { withSessionSsr } from "util/withSession";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
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
  return (
    <div>
      <Head>
        <title>Eden Examples</title>
        <meta name="description" content="Examples for using Eden.art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPageContent />
    </div>
  );
};

export default Home;
