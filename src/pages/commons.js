import Add from "@/components/add";
import Attest from "@/components/attest";
import Profile from "@/components/profile";
import ProfileSearch from "@/components/profileSearch";
import Profiles from "@/components/profiles";
import { Social } from "@/config";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/app.module.css";
import { getViaApiServer } from "@/utils/common";

export default function Commons() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [attestations, setAttestions] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [attestors, setAttestors] = useState([]);
  const [builders, setBuilders] = useState([]);

  const accountId = signedAccountId ?? "every.near";
  const graphId = "commons";

  useEffect(() => {
    if (accountId && signedAccountId) {
      getViaApiServer({
        keys: [`*/graph/${graphId}/*`],
        signer: wallet,
      }).then((data) => setAttestions(data));
    }
  }, []);

  useEffect(() => {
    if (!attestations) {
      return;
    }
    const attestorSet = new Set();
    const builderSet = new Set();

    Object.entries(attestations).forEach(([attestor, data]) => {
      attestorSet.add(attestor);
      Object.keys(data.graph[graphId]).forEach((builder) => {
        builderSet.add(builder);
      });
    });

    setAttestors(Array.from(attestorSet));
    setBuilders(Array.from(builderSet));

    const newMatrix = Array.from(builderSet).map((builder) =>
      Array.from(attestorSet).map((attestor) => ({
        attestorId: attestor,
        builderId: builder,
      })),
    );

    setMatrix(newMatrix);
  }, [attestations]);

  if (!attestations) {
    return (
      <div className={styles.graphContainer}>
        <div class="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div className="m-2">
      <Add graphId={graphId} />
      <div>
        {builders.map((a) => (
          <div key={a} className="m-2 d-flex flex-row align-items-center my-2">
            <div
              className="m-1 d-flex align-items-center"
              style={{
                maxWidth: "50%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {signedAccountId && (
                <Attest selectedAccountId={a} graphId={graphId} />
              )}
              <span
                style={{
                  fontFamily: "Courier",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                className="ms-3"
              >
                <Profile accountId={a} />
              </span>
            </div>
            <div style={{ flex: 1, textAlign: "-webkit-right" }}>
              <Profiles selectedAccountId={a} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
