import React, { useMemo, useState } from "react";

export default function ASULeaderboard() {
  const data = [
    { id: 1, name: "Alexa Quijano", coins: 240, section: "EEE120-001" },
    { id: 2, name: "Ethan Xiong", coins: 220, section: "EEE120-002" },
    { id: 3, name: "Zachary Jeantete", coins: 205, section: "EEE120-001" },
    { id: 4, name: "Yosef Ossowiecki", coins: 198, section: "EEE120-003" },
    { id: 5, name: "Alicia Baumman", coins: 190, section: "EEE120-002" },
    { id: 6, name: "Olga Example", coins: 172, section: "EEE120-001" },
    { id: 7, name: "Student Seven", coins: 165, section: "EEE120-003" },
    { id: 8, name: "Student Eight", coins: 160, section: "EEE120-002" },
    { id: 9, name: "Student Nine", coins: 158, section: "EEE120-001" },
    { id: 10, name: "Student Ten", coins: 154, section: "EEE120-003" },
  ];

  const [sectionFilter, setSectionFilter] = useState("ALL");

  const sections = useMemo(() => {
    const set = new Set(data.map((s) => s.section).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    const arr =
      sectionFilter === "ALL"
        ? data.slice()
        : data.filter((s) => s.section === sectionFilter);

    arr.sort((a, b) => b.coins - a.coins);
    return arr;
  }, [data, sectionFilter]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <section className="lb-wrap">
      <div className="lb-card">
        <div className="lb-head">
          <h1 className="lb-title">LogicCoin leaderboard</h1>

          <div className="lb-filter">
            <label className="lb-filter-label" htmlFor="leaderboard-section">
              Class section
            </label>
            <select
              id="leaderboard-section"
              className="lb-filter-select"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
            >
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === "ALL" ? "All sections" : sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lb-podium">
          {top3.map((student, index) => (
            <div className="lb-podium-card" key={student.id}>
              <div className="lb-rank-badge">#{index + 1}</div>
              <div className="lb-name">{student.name}</div>
              <div className="lb-coins">
                <strong>{student.coins}</strong>
                <span className="lb-suffix">coins</span>
              </div>
              <div className="lb-section">{student.section}</div>
            </div>
          ))}
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
              {rest.map((student, index) => (
                <tr key={student.id}>
                  <td className={`lb-rank ${index < 3 ? "lb-top" : ""}`}>
                    {index + 4}
                  </td>
                  <td>{student.name}</td>
                  <td>{student.section}</td>
                  <td className="lb-coins-cell">
                    <strong>{student.coins}</strong>
                    <span className="lb-suffix">coins</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lb-note">
          Rankings are based on current LogicCoin totals.
        </div>
      </div>
    </section>
  );
}