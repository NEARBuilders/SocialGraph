import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";

export default function Profile({ accountId }) {
  const { wallet } = useContext(NearContext);
  const [profile, setProfile] = useState(null);
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
    if (accountId) {
      getViaApiServer({
        keys: [`${accountId}/profile/*`],
        signer: wallet,
      }).then((data) => setProfile(data[accountId].profile));
    }
  }, [accountId]);

  const name = profile?.name;
  const imageSrc = `https://i.near.social/magic/large/https://near.social/magic/img/account/${accountId}`;

  return (
    <div className="d-flex gap-2">
      <img src={imageSrc} height={40} width={40} className="rounded-circle" />
      <div className="d-flex flex-column">
        <h5 className="mb-0"> {name}</h5>
        <div>{accountId}</div>
      </div>
    </div>
  );
}
