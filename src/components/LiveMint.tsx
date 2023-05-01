import React from "react";
import { useWaitForTransaction } from "wagmi";
import useLiveMint from "../hooks/useLiveMint";

const LiveMint = () => {
  const { data, write } = useLiveMint();
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onMintButtonClicked = () => {
    console.log(write);
    write?.();
  };

  return (
    <>
      <h4>Eden Livemint</h4>
      <button onClick={onMintButtonClicked} disabled={isLoading}>
        Claim Token
      </button>
    </>
  );
};

export default LiveMint;
