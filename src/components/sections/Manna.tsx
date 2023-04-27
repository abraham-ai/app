import { useState, useEffect } from "react";
import { useMannaBalance } from "hooks/useMannaBalance";

const Manna = () => {

  const { error, manna, mutate } = useMannaBalance();

  return (
    (
      <div className="section" id="manna" style={{
        margin: 20,
        fontSize: 20,
      }}>
        {manna >= 0 ? <><b>Manna:</b> {manna.toLocaleString("en-us")}</> : null}
      </div>  
    )
  );
};

export default Manna;