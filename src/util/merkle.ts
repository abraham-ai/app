import { MerkleTree } from "merkletreejs";
import { utils } from "ethers";

const addressesString = process.env.NEXT_PUBLIC_ALLOWLIST;
const addresses = addressesString ? addressesString.split(",") : [];

const tree = new MerkleTree(addresses.map(utils.keccak256), utils.keccak256, {
  sortPairs: true,
});

export function getMerkleRoot() {
  return tree.getRoot().toString("hex");
}

export function getMerkleProof(address: string | undefined) {
  if (!address) return;
  const hashedAddress = utils.keccak256(address);
  return tree.getHexProof(hashedAddress);
}
