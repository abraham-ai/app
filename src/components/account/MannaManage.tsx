import React, { useState, useEffect } from "react";
import { useMannaBalance } from "hooks/useMannaBalance";
import { Button, message} from "antd";
import { useAccount } from "wagmi";

const MannaManage = () => {
  const { isConnected } = useAccount();
  const { error, manna, mutate } = useMannaBalance();
  const [loading, setLoading] = useState(false);

  const handleDepositManna = async () => {
    setLoading(true);
    const code = prompt("Enter Manna voucher code: ");
    if (!code) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/redeemmanna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      if (result.error) {
        message.error(result.error);
      }
      else if (result.balance) {
        mutate({ manna: result.balance });
        message.success(`Manna redeemed!`);
      }
    } catch (error: any) {
      message.error(`Failed to redeem manna: ${error.message}`);
    } 
    setLoading(false);
  };

  return (
    <>
      <h2>Manna</h2>
      {error && (
        <p style={{color: "red"}}>{error}</p>
      )}
      {manna && (
        <p>{`You have ${manna.toLocaleString("en-us")} manna`}</p>
      )}
      <p>
        <Button type="primary" onClick={() => handleDepositManna()} loading={loading}>
          Redeem Manna
        </Button>
      </p>
    </>
  );
};

export default MannaManage;
