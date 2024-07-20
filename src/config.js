import { Social as BuildDAOSocial } from "@builddao/near-social-js";

export const NetworkId = "mainnet";

export const getConfig = () => {
  switch (NetworkId) {
    case "mainnet":
      return {
        networkId: "mainnet",
        nodeUrl: "https://free.rpc.fastnear.com/",
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
        indexerUrl: "https://api.kitwallet.app",
        socialDBContract: "social.near",
      };
    case "testnet":
    case "local":
      return {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.pagoda.co",
        walletUrl: "https://wallet.testnet.near.org",
        indexerUrl: "https://testnet-api.kitwallet.app",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        socialDBContract: "v1.social08.testnet",
      };

    default:
      throw Error(
        `Unconfigured environment '${network}'. Can be configured in src/config.js.`,
      );
  }
};

export const Social = new BuildDAOSocial({
  contractId: getConfig().socialDBContract,
});
