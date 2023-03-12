import React, { useCallback, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import AppContext from 'context/AppContext';
import MainPageContent from "components/MainPageContent";
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

const Home: NextPage = () => {
  const { isConnected } = useAccount()
  const { setIsSignedIn, setUsername } = useContext(AppContext);

  const checkAuthToken = useCallback(async () => {
    const response = await axios.post('/api/user');
    if (response.data.token) {
      setIsSignedIn(true);
      setUsername(response.data.username);
    }
  }, [setIsSignedIn]);

  useEffect(() => {
    if (isConnected) {
      checkAuthToken();
    }
  }, [checkAuthToken])

  return (
    <div>
      <Head>
        <title>Eden App</title>
        <meta name="description" content="Eden.art API interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPageContent />
    </div>
  );
};

export default Home;
