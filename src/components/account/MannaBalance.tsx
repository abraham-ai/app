import { useMannaBalance } from "hooks/useMannaBalance";

const MannaBalance = () => {

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

export default MannaBalance;