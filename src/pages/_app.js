import { useEffect, useState } from "react";

import "@/styles/globals.css";
import { NearContext } from "@/context";
import { Navigation } from "@/components/navigation";

import { Wallet } from "@/wallets/near";
import { NetworkId, getConfig } from "@/config";
import "bootstrap/dist/css/bootstrap.min.css";

const wallet = new Wallet({
  createAccessKeyFor: getConfig().socialDBContract,
  networkId: NetworkId,
});

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState("");

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <Navigation />
      <Component {...pageProps} />
    </NearContext.Provider>
  );
}
