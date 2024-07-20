import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";

export default function Attest({ selectedAccountId, graphId }) {
  const { signedAccountId, wallet } = useContext(NearContext);
  const accountId = selectedAccountId || "every.near";

  const [graphEdge, setGraphEdge] = useState(null);
  const [inverseEdge, setInverseEdge] = useState(null);
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
  }, [accountId, signedAccountId]);

  const loading = graphEdge === null || inverseEdge === null;
  const attested = graphEdge && Object.keys(graphEdge).length;

  const data = {
    graph: { [graphId]: { [accountId]: attested ? null : "" } },
  };

  const attest = async () => {
    const signer = await wallet.getAccountConnection();
    const accessKeys = await signer.getAccessKeys();
    const key = (await wallet.selector).store.getState().accounts[0].publicKey;
    const transaction = await Social.set({
      data: data,
      publicKey: key,
      signer: signer,
    });

    console.log(transaction);
  };
  return (
    <>
      {signedAccountId && (
        <>
          <button
            disabled={loading ?? !signedAccountId}
            className={`btn btn-sm ${attested ? "btn-dark" : "btn-outline-dark"}`}
            onClick={attest}
          >
            {attested ? (
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
