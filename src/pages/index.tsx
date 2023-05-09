import React, { useCallback, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import AppContext from 'context/AppContext';
import MainPageContent from "components/MainPageContent";
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount()
  const { setIsSignedIn, setUsername } = useContext(AppContext);

  const checkAuthToken = useCallback(async () => {
    try {
      const response = await axios.post('/api/user', {userAddress: address});
      if (response.data.token && response.data.address == address) {
        setIsSignedIn(true);
        setUsername(response.data.username);
      } else {
        setIsSignedIn(false);
      }
    } catch (error: any) {
      setIsSignedIn(false);
    }
  }, [setIsSignedIn, address]);

  useEffect(() => {
    if (isConnected) {
      checkAuthToken();
    }
  }, [checkAuthToken])

  return (
    <div>
      <Head>
        <title>Eden App</title>
        <meta name="description" content="Eden API interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPageContent />
    </div>
  );
};

export default Home;
