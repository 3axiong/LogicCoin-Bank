import React from "react";

export default function ASULeaderboard() {
  const ASU = {
    maroon: "#8C1D40",
    gold: "#FFC627",
    dark: "#191919",
    light: "#F7F7F7",
  };

  
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
    const set = new Set(data.map(s => s.section).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const arr = sectionFilter === "ALL"
      ? data.slice()
      : data.filter(s => s.section === sectionFilter);

    arr.sort((a, b) => b.coins - a.coins);
    return arr;
  }, [data, sectionFilter]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  
