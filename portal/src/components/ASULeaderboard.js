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

  return (
    <section className="lb-wrap" aria-labelledby="lb-title">
      <div className="lb-card">
        <div className="lb-head">
          <h2 id="lb-title" className="lb-title">Leaderboard</h2>
        </div>

        {/* Top 3 */}
        <div className="lb-podium">
          {sorted.slice(0, 3).map((p, i) => (
            <div key={p.id} className={`lb-podium-card ${i === 0 ? "lb-gold" : "lb-maroon"}`}>
              <div className="lb-rank-badge">{i + 1}</div>
              <div className="lb-name">{p.name}</div>
              <div className="lb-coins">{p.coins}<span className="lb-suffix"> Coins</span></div>
            </div>
          ))}
        </div>

        {/* Full table */}
        <div className="lb-table-scroller">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th><th>Student</th><th>Coins</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, idx) => (
                <tr key={s.id}>
                  <td className={`lb-rank ${idx < 3 ? "lb-top" : ""}`}>{idx + 1}</td>
                  <td>{s.name}</td>
                  <td className="lb-coins-cell">
                    <strong>{s.coins}</strong> <span className="lb-suffix">Coins</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
