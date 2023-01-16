import { useCreditBalance } from "hooks/useCreditBalance";

const CreditBalance = () => {
  const { balance } = useCreditBalance();

  return (
    <>
      <h2>Credit Balance</h2>
      {balance ? (
        <p>{`Your current credit balance is: ${balance}`}</p>
      ) : (
        <p>Your credit balance is 0.</p>
      )}
    </>
  );
};

export default CreditBalance;
