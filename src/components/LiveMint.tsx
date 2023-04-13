import React, { useState } from "react";
import { Button } from "antd";

const LiveMint = () => {
  
  const [loading, setLoading] = useState<boolean>(false)

  const mint = async () =>{
    setLoading(true)

    console.log("minting!")
    await new Promise(r => setTimeout(r, 5000));

    setLoading(false);
  }

  return (
    <>
      {loading ? <p>loading...</p> : null}
      <Button onClick={mint}>Mint</Button>
    </>
  );
};

export default LiveMint;
