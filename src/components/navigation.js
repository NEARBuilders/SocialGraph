import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="d-flex gap-2 align-items-center justify-content-between w-100 px-4">
        <button className={getLinkClass("/")} onClick={() => router.push("/")}>
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
        </button>
        <div className="d-flex gap-4 align-items-center">
          <button
            onClick={() => router.push("/")}
            className={getLinkClass("/")}
          >
            <h6 className="mb-0"> Graph</h6>
          </button>
          <button
            onClick={() => router.push("/commons")}
            className={getLinkClass("/commons")}
          >
            <h6 className="mb-0"> Commons</h6>
          </button>
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
