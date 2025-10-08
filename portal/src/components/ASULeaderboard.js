import React from "react";

export default function ASULeaderboard() {
  const ASU = {
    maroon: "#8C1D40",
    gold: "#FFC627",
    dark: "#191919",
    light: "#F7F7F7",
  };

  // demo data 
  const data = [
    { id: 1, name: "Alexa Quijano", coins: 240 },
    { id: 2, name: "Ethan Xiong", coins: 220 },
    { id: 3, name: "Zachary Jeantete", coins: 205 },
    { id: 4, name: "Yosef Ossowiecki", coins: 198 },
    { id: 5, name: "Someone1", coins: 182 },
    { id: 6, name: "Someone2", coins: 171 },
    { id: 7, name: "Someone3", coins: 160 },
    { id: 8, name: "Someone4", coins: 158 },
  ];

  const sorted = [...data].sort((a, b) => b.coins - a.coins);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="asu-shell" style={{ background: `linear-gradient(180deg, ${ASU.maroon} 0%, ${ASU.maroon} 55%, ${ASU.dark} 100%)` }}>
      {/* Header */}
      <header className="asu-header">
        <h1 className="asu-title">LogicCoin Leaderboard</h1>
        <div className="asu-subtitle">Arizona State University</div>
        <p className="asu-desc">Top students by LogicCoin balance.</p>
      </header>

      {/* Podium */}
      <section className="asu-podium">
        {podium.map((p, i) => (
          <div
            key={p.id}
            className={`asu-podium-card ${i === 0 ? "asu-podium-gold" : "asu-podium-dark"}`}
          >
            <div className="asu-podium-inner">
              <div className="asu-podium-top">
                <span className={`asu-badge ${i === 0 ? "asu-badge-dark" : "asu-badge-light"}`}>
                  {i === 0 ? "CHAMPION" : i === 1 ? "RUNNER-UP" : "TOP 3"}
                </span>
                <span className={`asu-trophy ${i === 0 ? "asu-trophy-dark" : "asu-trophy-light"}`}>🏆</span>
              </div>
              <h3 className={`asu-name ${i === 0 ? "asu-text-dark" : "asu-text-light"}`}>{p.name}</h3>
              <div className={`asu-score ${i === 0 ? "asu-text-dark" : "asu-text-light"}`}>
                <span className="asu-score-num">{p.coins}</span>
                <span className="asu-score-unit">coins</span>
              </div>
            </div>
            <div className={`asu-ribbon ${i === 0 ? "asu-ribbon-dark" : "asu-ribbon-light"}`}>
              {i === 0 ? "Gold" : i === 1 ? "Silver" : "Bronze"}
            </div>
          </div>
        ))}
      </section>

      {/* Table */}
      <section className="asu-table-wrap">
        <div className="asu-table-card" style={{ borderColor: ASU.gold }}>
          <div className="asu-table-head">
            <h2 className="asu-table-title" style={{ color: ASU.maroon }}>Full Rankings</h2>
            <span className="asu-chip" style={{ background: ASU.gold, color: "#111" }}>
              ASU Colors
            </span>
          </div>

          <div className="asu-table-scroller">
            <table className="asu-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Coins</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, idx) => (
                  <tr key={s.id}>
                    <td className={`asu-rank ${idx < 3 ? "asu-rank-top" : ""}`}>{idx + 1}</td>
                    <td>{s.name}</td>
                    <td>
                      <span className="asu-coins">
                        <span className="asu-coins-num">{s.coins}</span>
                        <span className="asu-coins-suffix">LC</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="asu-note">
          * when Django API is ready
        </p>
      </section>
    </div>
  );
}
