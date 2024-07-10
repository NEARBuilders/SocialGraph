import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/app.module.css";

export default function CommonsGraph() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [accountIds, setAccountIds] = useState([
    signedAccountId ? signedAccountId : "buildcommons.near",
    "every.near",
    "hack.near",
    "buildcommons.near",
  ]);

  const [nodesState, setNodesState] = useState(null);
  const [focus, setFocus] = useState(null);

  const [selectedAccountId, setSelectedAccountId] = useState(signedAccountId);
  const [commons, setCommons] = useState(null);

  const [message, setMessage] = useState(null);
  const [graphEdge, setGraphEdge] = useState(null);
  const graphId = "commons";

  const generatePaths = () => {
    return accountIds.map((accountId) => {
      return `*/${accountId}/graph/${graphId}/*`;
    });
  };

  useEffect(() => {
    const paths = generatePaths();
    console.log(paths)
    Social.get({ keys: paths, signer: wallet }).then((data) =>
      setNodesState(data),
    );
  }, []);

  const debug = false;

  console.log(nodesState)

  // useEffect(() => {
  //   if (!nodesState) {
  //     return;
  //   }

  //   const nodes = {};
  //   const edges = [];

  //   const createNodesAndEdges = (accountId, graphData) => {
  //     if (!(accountId in nodes)) {
  //       nodes[accountId] = {
  //         id: accountId,
  //         size: 139,
  //       };
  //     }
  //     Object.values(graphData).forEach((links) => {
  //       console.log(graphData);
  //       Object.keys(links).forEach((memberId) => {
  //         if (!(memberId in nodes)) {
  //           nodes[memberId] = {
  //             id: memberId,
  //             size: 139,
  //           };
  //         }
  //         edges.push({
  //           source: accountId,
  //           target: memberId,
  //           value: 1,
  //         });
  //       });
  //     });
  //   };

  //   if (accountIds.length === 1) {
  //     const accountId = accountIds[0];
  //     createNodesAndEdges(accountId, { [graphId]: nodesState });
  //   } else if (accountIds.length > 1) {
  //     Object.entries(nodesState).forEach(([accountId, graphData]) => {
  //       createNodesAndEdges(accountId, graphData.graph);
  //     });
  //   }
  //   console.log("nodes", nodes);
  //   console.log("edges", edges);

  //   setMessage({
  //     nodes: Object.values(nodes),
  //     edges,
  //   });
  // }, [nodesState, accountIds]);

  // useEffect(() => {
  //   if (selectedAccountId) {
  //     if (accountIds.includes(selectedAccountId)) {
  //       setAccountIds(accountIds.filter((it) => it !== selectedAccountId));
  //     } else {
  //       setAccountIds([...accountIds, selectedAccountId]);
  //     }
  //   }
  // }, [selectedAccountId]);

  // useEffect(() => {
  //   Social.get({
  //     keys: [`${signedAccountId}/graph/commons`],
  //     signer: wallet,
  //   }).then((i) => setCommons(i));
  // }, []);

  // useEffect(() => {
  //   Social.get({
  //     keys: [`*/${signedAccountId}/graph/${graphId}/${signedAccountId}/*`],
  //     signer: wallet,
  //   }).then((i) => setGraphEdge(i));
  // }, []);

  const loading = graphEdge === null || inverseEdge === null;
  const attested = graphEdge && Object.keys(graphEdge).length;
  // const inverse = inverseEdge && Object.keys(inverseEdge).length;

  const type = attested ? "undo" : graphId;

  // const attestation = props.attestation ?? {
  //   graph: { [graphId]: { [signedAccountId]: attested ? null : "" } },
  // };

  // const attest = () => {
  //   Social.set(data);
  // };

  if (!nodesState) {
    return <div className={styles.graphContainer}></div>;
  }

  return (
    <>
      <div className={styles.graphContainer}></div>
      <div className={styles.profileContainer}>
        {commons ? (
          "Create"
        ) : (
          <h5 style={{ fontFamily: "Courier" }} className="m-1">
            JOIN
          </h5>
        )}
        Attest
      </div>
    </>
  );
}
