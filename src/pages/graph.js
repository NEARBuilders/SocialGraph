import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/app.module.css";
import Attest from "@/components/attest";
import D3Graph from "@/components/d3Graph";
import Profile from "@/components/profile";
import { getViaApiServer } from "@/utils/common";

export default function CommonsGraph() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const buildCommonsAccount = "buildcommons.near";
  const [accountIds, setAccountIds] = useState([
    "every.near",
    "hack.near",
    buildCommonsAccount,
  ]);

  useEffect(() => {
    if (signedAccountId) {
      const newArray = [...accountIds];
      accountIds.unshift(signedAccountId);
      setAccountIds(newArray);
    }
  }, [signedAccountId]);

  const [nodesState, setNodesState] = useState(null);

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [commons, setCommons] = useState(null);

  const [message, setMessage] = useState(null);
  const graphId = "commons";

  const generatePaths = () => {
    return accountIds.map((accountId) => {
      return `${accountId}/graph/${graphId}/*`;
    });
  };

  useEffect(() => {
    const paths = generatePaths();
    getViaApiServer({ keys: paths, signer: wallet }).then((data) =>
      setNodesState(data),
    );
  }, [accountIds]);

  const debug = false;

  useEffect(() => {
    if (!nodesState) {
      return;
    }

    const nodes = {};
    const edges = [];

    const createNodesAndEdges = (accountId, graphData) => {
      if (!(accountId in nodes)) {
        nodes[accountId] = {
          id: accountId,
          size: 139,
        };
      }
      Object.values(graphData).forEach((links) => {
        Object.keys(links).forEach((memberId) => {
          if (!(memberId in nodes)) {
            nodes[memberId] = {
              id: memberId,
              size: 139,
            };
          }
          edges.push({
            source: accountId,
            target: memberId,
            value: 1,
          });
        });
      });
    };

    if (accountIds.length === 1) {
      const accountId = accountIds[0];
      createNodesAndEdges(accountId, { [graphId]: nodesState });
    } else if (accountIds.length > 1) {
      Object.entries(nodesState).forEach(([accountId, graphData]) => {
        createNodesAndEdges(accountId, graphData.graph);
      });
    }

    setMessage({
      nodes: Object.values(nodes),
      edges,
    });
  }, [nodesState, accountIds]);

  useEffect(() => {
    if (selectedAccountId) {
      if (accountIds.includes(selectedAccountId)) {
        setAccountIds(accountIds.filter((it) => it !== selectedAccountId));
      } else {
        setAccountIds([...accountIds, selectedAccountId]);
      }
    }
  }, [selectedAccountId]);

  useEffect(() => {
    getViaApiServer({
      keys: [`${signedAccountId}/graph/commons/*`],
      signer: wallet,
    }).then((i) => setCommons(i));
  }, []);

  if (!nodesState) {
    return (
      <div className={styles.graphContainer}>
        <div class="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.graphContainer}>
        <div
          className="w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            minHeight: "325px",
            maxWidth: "888px",
          }}
        >
          <D3Graph
            data={message}
            onClickOfItem={(data) => setSelectedAccountId(data)}
            onMouseOutOfItem={(data) => {}}
            onMouseOverOfItem={(data) => {}}
          />
        </div>
      </div>
      <div className={styles.profileContainer}>
        {commons ? (
          <Profile accountId={selectedAccountId ?? buildCommonsAccount} />
        ) : (
          <h5 style={{ fontFamily: "Courier" }} className="m-1">
            JOIN
          </h5>
        )}
        <Attest
          selectedAccountId={selectedAccountId ?? buildCommonsAccount}
          graphId={graphId}
        />
      </div>
    </>
  );
}
