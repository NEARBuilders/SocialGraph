import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";

import { NearContext } from "@/context";
import NearLogo from "/public/near-logo.svg";

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => {});
  const [label, setLabel] = useState("Loading...");

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel("Login");
    }
  }, [signedAccountId, wallet]);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link href="/" passHref legacyBehavior>
          <div className="d-flex align-items-center gap-2">
            <Image
              priority
              src={
                "https://i.near.social/magic/large/https://near.social/magic/img/account/buildcommons.near"
              }
              alt="NEAR"
              width="50"
              height="50"
              className="d-inline-block align-text-top rounded-circle"
            />
            <h6 className="mb-0"> Social Graph</h6>
          </div>
        </Link>

        <div className="navbar-nav pt-1">
          <button className="btn btn-secondary" onClick={action}>
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
