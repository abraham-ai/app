import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { BigNumber } from "ethers";
import { useWaitForTransaction } from "wagmi";
import useMint from "../hooks/useMint";
import {useMints} from "../hooks/useMints";
import ImageResult from "components/media/ImageResult";


const LiveMint = () => {
  console.log("GO!")
  const [loading, setLoading] = useState<boolean>(false)
  
  const { mints, error, mutate } = useMints();

console.log("mints")
console.log(mints);


  const [balance, setBalance] = React.useState<BigNumber | undefined>(
    undefined
  );
  const { data, write } = useMint();
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onMintButtonClicked = () => {
    setLoading(true)
    write?.();
    setLoading(false);
  };

  return (
    <>
      <Button onClick={onMintButtonClicked}>Mint</Button>
      {loading ? <p>loading...</p> : null}
      <div>
        {mints?.map((mint: any) => (
          <div key={mint._id} style={{margin: 20}}>
            <img src={mint.imageUri} width="300" />
          </div>
        ))}
      </div>
      
    </>
  );
};

export default LiveMint;
