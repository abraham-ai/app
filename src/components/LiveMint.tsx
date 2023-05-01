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
      {/* <div>
        {mints?.map((mint: any) => (
          <div key={mint._id} style={{margin: 20}}>
            <img src={mint.imageUri} width="300" />
          </div>
        ))}
      </div> */}
    </>
  );
};

export default LiveMint;
