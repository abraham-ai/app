import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { contracts } from "../const/contracts";

const useMint = () => {
  const { config, error } = usePrepareContractWrite({
    address: contracts.HiLoToken.address,
    abi: contracts.HiLoToken.abi,
    functionName: "mint",
  });
  if (error) {
    console.error(error);
  }
  return useContractWrite(config);
};

export default useMint;
