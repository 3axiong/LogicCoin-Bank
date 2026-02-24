import React, { useMemo, useState, useEffect } from "react";
import { fetchJson } from "./api";

export default function ASULeaderboard() {
  const ASU = {
    maroon: "#8C1D40",
    gold: "#FFC627",
    dark: "#191919",
    light: "#F7F7F7",
  };

  const METALS = {
    gold: "#FFC627",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
  };

  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const json = await fetchJson("/api/leaderboard/");
        setData(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sections = useMemo(() => {
    const set = new Set(data.map(s => s.section).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    const arr = sectionFilter === "ALL"
      ? data.slice()
      : data.filter(s => s.section === sectionFilter);
    arr.sort((a, b) => b.coins - a.coins);
    return arr;
  }, [data, sectionFilter]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <section className="lb-wrap" style={{ background: ASU.light, color: ASU.dark }}>
      <div className="lb-card" style={{ borderColor: ASU.maroon }}>
        <div className="lb-head" style={{ borderBottomColor: ASU.maroon }}>
          <div className="lb-title">
            <h1 style={{
              color: `${ASU.maroon} !important`,
              fontWeight: 900,
              opacity: 1,
              filter: "none",
              margin: 0,
              textShadow: "0 0 0 #000"
            }}>
              LogicCoin Leaderboard
            </h1>
          </div>

          <div className="lb-filter">
            <label className="lb-filter-label">Class Section</label>
            <select
              className="lb-filter-select"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
            >
              {sections.map(sec => (
                <option key={sec} value={sec}>
                  {sec === "ALL" ? "All Sections" : sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lb-podium">
          {top3.map((s, i) => {
            const bg =
              i === 0 ? METALS.gold :
              i === 1 ? METALS.silver :
              METALS.bronze;

            const textColor = i === 2 ? "#FFFFFF" : ASU.dark; 

            return (
              <div
                className="lb-podium-card"
                key={s.id}
                style={{
                  background: bg,
                  color: textColor,
                  border: "2px solid rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="lb-rank-badge"
                  style={{
                    background: ASU.dark,
                    color: "#fff",
                    border: "2px solid #00000022",
                  }}
                >
                  #{i + 1}
                </div>

                <div
                  className="lb-name"
                  style={{ color: textColor, fontWeight: 800 }}
                >
                  {s.name}
                </div>

                <div className="lb-coins" style={{ color: textColor }}>
                  <strong>{s.coins}</strong> <span className="lb-suffix">Coins</span>
                </div>

                <div className="lb-section" style={{ fontSize: "12px", opacity: 0.9, color: textColor }}>
                  {s.section}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lb-table-scroller">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Section</th>
                <th>Coins</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((s, idx) => (
                <tr key={s.id}>
                  <td className={`lb-rank ${idx < 3 ? "lb-top" : ""}`}>{idx + 4}</td>
                  <td>{s.name}</td>
                  <td>{s.section}</td>
                  <td className="lb-coins-cell">
                    <strong>{s.coins}</strong> <span className="lb-suffix">Coins</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .lb-filter { display: flex; align-items: center; gap: 8px; }
        .lb-filter-label { font-weight: 600; }
        .lb-filter-select {
          padding: 6px 10px;
          border: 2px solid #8C1D40;
          border-radius: 10px;
          background: #fff;
          font-weight: 600;
        }
        .lb-podium {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 20px 24px;
        }
        .lb-podium-card {
          position: relative;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .lb-rank-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 12px;
        }
        .lb-name { margin-top: 10px; font-size: 16px; }
        .lb-coins { margin-top: 6px; font-size: 20px; font-weight: 800; }
        .lb-section { margin-top: 2px; }
        @media (max-width: 720px) {
          .lb-podium { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
