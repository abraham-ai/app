import { useMannaBalance } from "hooks/useMannaBalance";

const MannaBalance = () => {
  const { error, manna } = useMannaBalance();

  console.log("GOT BALA")
  console.log(manna)

  return (
    <>
      <h2>Manna 11</h2>
      {error && (
        <p style={{color: "red"}}>{error}</p>
      )}
      {manna && (
        <p>{`You have ${manna} manna`}</p>
      )}
    </>
  );
};

export default MannaBalance;
