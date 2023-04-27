import EdenLivemintContract from "../const/EdenLivemint.json";
import Broadcast from "../const/run-latest.json";

type HexAddress = `0x${string}`;

const getContractAddress = (contractName: string): HexAddress => {
  const contract = Broadcast.transactions.find(
    (contract) => contract.contractName === contractName
  );
  if (!contract) {
    throw new Error(`Contract ${contractName} not found`);
  }
  return contract.contractAddress as HexAddress;
};

export const contracts = {
  HiLoToken: {
    address: getContractAddress("EdenLivemint"),
    abi: EdenLivemintContract.abi,
  },
};
