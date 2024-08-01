import Attest from "@/components/attest";
import Profile from "@/components/profile";
import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "@/styles/app.module.css";

export default function OverlayProfile({ selectedAccountId }) {
  const { signedAccountId, wallet } = useContext(NearContext);
  const renderTooltip = (props) => (
    <Tooltip {...props}>
      <div
        style={{ fontFamily: "Courier" }}
        className="m-1 gap-1 d-flex flex-row justify-content-between align-items-center"
      >
        <Profile accountId={selectedAccountId} />
        <Attest selectedAccountId={selectedAccountId} />
      </div>
    </Tooltip>
  );

  function entering(e) {
    e.children[1].style.backgroundColor = "#eca227";
    e.children[1].style.width = "400px";
    e.children[1].style.fontSize = "12px";
  }

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 500 }}
      overlay={renderTooltip}
      onEntering={entering}
      rootClose={true}
    >
      <span className={styles.overlay}>
        <Profile accountId={selectedAccountId} showName={false} />
      </span>
    </OverlayTrigger>
  );
}
