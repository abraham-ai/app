import { useMannaBalance } from "hooks/useMannaBalance";

const MannaBalance = () => {
  const { error, manna } = useMannaBalance();

  return (
    <>
      <h2>Manna</h2>
      {error && (
        <p style={{color: "red"}}>{error}</p>
      )}
      {manna && (
        <p>{`You have ${manna.toLocaleString("en-us")} manna`}</p>
      )}
    </>
  );
};

export default MannaBalance;
