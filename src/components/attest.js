import { Social, getConfig } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import { getViaApiServer, transformActions } from "@/utils/common";
import { toast } from "react-toastify";
import Toast from "@/components/toast";

export default function Attest({ selectedAccountId, graphId = "commons" }) {
  const { socialDBContract } = getConfig();
  const { signedAccountId, wallet } = useContext(NearContext);
  const accountId = selectedAccountId || "every.near";

  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [attested, setAttested] = useState(false);

  useEffect(() => {
    if (accountId && signedAccountId) {
      getViaApiServer({
        keys: [`${signedAccountId}/graph/${graphId}/${accountId}`],
        signer: wallet,
      }).then((data) => {
        setAttested(Object.keys(data ?? {}).length);
      });
    }
  }, [accountId, signedAccountId, refresh]);

  const data = {
    [signedAccountId]: {
      graph: { [graphId]: { [accountId]: attested ? null : "" } },
    },
  };

  const attest = async () => {
    try {
      setLoading(true);
      const nearAccount = await wallet.getNearAccount();
      const transaction = await Social.set({
        data: data,
        account: {
          publicKey: nearAccount.publicKey,
          accountID: nearAccount.accountId,
        },
      });
      console.log(transaction);
      const transformedActions = transformActions(transaction.actions);
      await wallet.signAndSendTransaction({
        contractId: socialDBContract,
        actions: transformedActions,
      });
      setRefresh(!refresh);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Error setting attest:", error);
      setLoading(false);
    }
  };
  return (
    <>
      <Toast />
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
