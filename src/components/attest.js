import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";

export default function Attest({ selectedAccountId, graphId }) {
  const { signedAccountId, wallet } = useContext(NearContext);
  const accountId = selectedAccountId || "every.near";

  const [graphEdge, setGraphEdge] = useState(null);
  const [inverseEdge, setInverseEdge] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  async function getViaApiServer({ keys }) {
    const args = {
      keys,
    };

    return await (
      await fetch("https://api.near.social/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      })
    ).json();
  }

  useEffect(() => {
    if (accountId && signedAccountId) {
      getViaApiServer({
        keys: [`${signedAccountId}/graph/${graphId}/${accountId}`],
        signer: wallet,
      }).then((data) => setGraphEdge(data));
      getViaApiServer({
        keys: [`${accountId}/graph/${graphId}/${signedAccountId}/*`],
        signer: wallet,
      }).then((data) => setInverseEdge(data));
    }
  }, [accountId, signedAccountId, refresh]);

  const attested = graphEdge && Object.keys(graphEdge).length;

  const data = {
    [signedAccountId]: {
      graph: { [graphId]: { [accountId]: attested ? null : "" } },
    },
  };

  const attest = async () => {
    setLoading(true);
    const signer = await wallet.getAccountConnection();
    const key = (await signer.getAccessKeys())?.[0].public_key;
    const isWritePermissionGranted = await Social.isWritePermissionGranted({
      granteePublicKey: key,
      signer: signer,
      key: `${signedAccountId}/graph/${graphId}/${accountId}`,
    });
    if (!isWritePermissionGranted) {
      const grantWritePermission = await Social.grantWritePermission({
        publicKey: key,
        granteeAccountId: signedAccountId,
        keys: [`${signedAccountId}/graph/${graphId}/${accountId}`],
        signer: signer,
      });
      await signer.signAndSendTransaction(grantWritePermission);
    }
    const transaction = await Social.set({
      data: data,
      publicKey: key,
      signer: signer,
    });
    await signer.signAndSendTransaction(transaction);
    console.log(transaction);
    setRefresh(!refresh);
    setLoading(false);
  };
  return (
    <>
      {signedAccountId && (
        <>
          <button
            disabled={isLoading ?? !signedAccountId}
            className={`btn btn-sm ${attested ? "btn-dark" : "btn-outline-dark"}`}
            onClick={attest}
          >
            {isLoading ? (
              <span class="spinner-border spinner-border-sm"></span>
            ) : attested ? (
              <i className="bi bi-x"></i>
            ) : (
              <i className="bi bi-plus"></i>
            )}
          </button>
        </>
      )}
    </>
  );
}
