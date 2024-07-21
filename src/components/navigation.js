import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";

import { NearContext } from "@/context";
import NearLogo from "/public/near-logo.svg";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => {});
  const [label, setLabel] = useState("Loading...");
  const pathname = usePathname();

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

  const getLinkClass = (path) => {
    return `nav-link mb-0 ${pathname === path ? "active" : ""}`;
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="d-flex gap-2 align-items-center justify-content-between w-100 px-4">
        <Link href="/" className={getLinkClass("/")}>
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
        <div className="d-flex gap-4 align-items-center">
          <Link href="/" className={getLinkClass("/")}>
            <h6 className="mb-0"> Graph</h6>
          </Link>
          <Link href="/commons" className={getLinkClass("/commons")}>
            <h6 className="mb-0"> Commons</h6>
          </Link>
        </div>
        <div className="navbar-nav pt-1">
          <button className="btn btn-secondary" onClick={action}>
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
