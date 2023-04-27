import EdenLivemintContract from "../../../eden-provenance/contracts/out/EdenLivemint.sol/EdenLivemint.json";
import BroadcastGoerli from "../../../eden-provenance/contracts/broadcast/Deploy.s.sol/5/run-latest.json";

const getContractAddress = (contractName: string) => {
  const chain = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV;

  let broadcast;
  switch (chain) {
    case "goerli":
      broadcast = BroadcastGoerli;
      break;
    default:
      throw new Error(`Chain ${chain} not supported`);
  }

  const contract = broadcast.transactions.find(
    (contract) => contract.contractName === contractName
  );
  if (!contract) {
    throw new Error(`Contract ${contractName} not found`);
  }
  return contract.contractAddress;
};

export const contracts = {
  LiveMint: {
    address: getContractAddress("EdenLivemint"),
    abi: EdenLivemintContract.abi,
  },
};
