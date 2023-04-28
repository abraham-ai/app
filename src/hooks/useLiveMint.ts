import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi";
import { contracts } from "../const/contracts";
import { getMerkleProof } from "util/merkle";

const useLiveMint = () => {
  console.log("contract address", contracts.LiveMint.address);
  const { address } = useAccount();
  console.log("my address", address)
  const merkleProof = getMerkleProof(address || undefined);
  console.log("mmm", merkleProof);
  const { config, error } = usePrepareContractWrite({
    address: contracts.LiveMint.address as `0x${string}`,
    abi: contracts.LiveMint.abi,
    functionName: "mint",
    args: [merkleProof],
  });
  if (error) {
    console.error(error);
  }
  return useContractWrite(config);
};

export default useLiveMint;
