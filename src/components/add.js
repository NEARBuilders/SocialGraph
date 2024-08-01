import Attest from "@/components/attest";
import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import Profiles from "./profiles";
import ProfileSearch from "./profileSearch";

export default function Add() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [profiles, setProfiles] = useState(null);

  if (!signedAccountId) {
    return "";
  }

  return (
    <div className="m-2">
      <div className="mb-3">
        <ProfileSearch
          onChange={({ result }) => setProfiles(result)}
          limit={5}
        />
      </div>
      {profiles && profiles.length > 0 && (
        <div className="mb-2">
          {profiles.map(({ accountId }, i) => (
            <div
              key={accountId}
              className="m-2 d-flex flex-row justify-content-between align-items-center"
            >
              <div className="m-2 d-flex align-items-center">
                {signedAccountId && <Attest selectedAccountId={accountId} />}
                <span className="ms-2">
                  <Profiles builders={[accountId]} />
                </span>
              </div>
              <div className="m-2 d-flex align-items-center">
                <Profiles selectedAccountId={accountId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
