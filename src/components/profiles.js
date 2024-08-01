import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/app.module.css";
import OverlayProfile from "./overlayProfile";
import { getViaApiServer } from "@/utils/common";

export default function Profiles({ selectedAccountId, builders }) {
  const { signedAccountId, wallet } = useContext(NearContext);
  const accountId = selectedAccountId || signedAccountId || "every.near";
  const [buildersObject, setBuilders] = useState(null);

  useEffect(() => {
    if (accountId) {
      getViaApiServer({
        keys: [`*/graph/commons/${accountId}`],
        signer: wallet,
      }).then((data) => setBuilders(data));
    }
  }, [accountId]);

  if (!buildersObject) {
    return "";
  }

  const displayBuilders = builders || Object.keys(buildersObject);

  return (
    <div className={"ms-2 w-100 justify-content-end " + styles.face}>
      {displayBuilders.map((accountId, i) => (
        <OverlayProfile selectedAccountId={accountId} key={i} />
      ))}
    </div>
  );
}
