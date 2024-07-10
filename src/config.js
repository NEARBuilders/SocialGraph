import { Social as BuildDAOSocial } from "@builddao/near-social-js";

const contractPerNetwork = {
  mainnet: "social.near",
  testnet: "v1.social08.testnet",
};

export const NetworkId = "mainnet";
const currentContract = contractPerNetwork[NetworkId];
export const SocialDBContract = currentContract;

export const Social = new BuildDAOSocial({
  contractId: currentContract,
});
