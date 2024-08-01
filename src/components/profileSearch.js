import { Social } from "@/config";
import { NearContext } from "@/context";
import { getViaApiServer } from "@/utils/common";
import { useContext, useEffect, useState } from "react";

export default function ProfileSearch({ onChange, debug, limit = 30 }) {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [profiles, setProfiles] = useState(null);
  const [searchTerm, setTerm] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getViaApiServer({
      keys: ["*/profile/name", "*/profile/tags/*"],
      signer: wallet,
    }).then((data) => setProfiles(data));
  }, []);

  const computeResults = (term) => {
    const terms = (term || "")
      .toLowerCase()
      .split(/[^\w._-]/)
      .filter((s) => !!s.trim());
    const matchedAccountIds = [];

    const MaxSingleScore = 20;
    const MaxScore = MaxSingleScore * 3;

    const computeScore = (s) => {
      s = s.toLowerCase();
      return (
        terms
          .map((term) => {
            const pos = s.indexOf(term);
            return pos >= 0 ? Math.max(1, 20 - pos) : 0;
          })
          .reduce((s, v) => s + v, 0) / terms.length
      );
    };

    Object.entries(profiles ?? {}).forEach(([accountId, data]) => {
      const accountIdScore = computeScore(accountId);
      const name = data.profile.name || "";
      const tags = Object.keys(data.profile.tags || {}).slice(0, 10);
      const nameScore = computeScore(name);
      const tagsScore = Math.min(
        20,
        tags.map(computeScore).reduce((s, v) => s + v, 0),
      );
      const score = (accountIdScore + nameScore + tagsScore) / MaxScore;
      if (score > 0) {
        matchedAccountIds.push({ score, accountId, name, tags });
      }
    });

    matchedAccountIds.sort((a, b) => b.score - a.score);
    const result = matchedAccountIds.slice(0, limit);

    setTerm(term);
    setResult(result);
    if (typeof onChange === "function") {
      onChange({ term, result });
    }
  };

  return (
    <>
      <div className="input-group">
        <input
          type="text"
          className={`form-control ${searchTerm ? "border-end-0" : ""}`}
          value={searchTerm ?? ""}
          onChange={(e) => computeResults(e.target.value)}
          placeholder="➕ Add Builders"
        />
        {searchTerm && (
          <button
            className="btn btn-outline-secondary border border-start-0"
            type="button"
            onClick={() => computeResults("")}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
      {debug && <pre>{JSON.stringify(state.result, undefined, 2)}</pre>}
    </>
  );
}
