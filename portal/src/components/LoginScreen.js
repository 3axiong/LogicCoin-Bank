import React, { useState } from "react";

export default function LoginScreen({ role, onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.(); //to test
  };

  return (
    <div className="app">
      <div className="main-content">
        <div className="left-section">
          <div className="logo-section">
            <div className="logo-circle">
              <div className="logo-text">ASU LOGO</div>
              <div className="globe-icon">🌐</div>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="welcome-text">Login</div>
          <h1 className="main-title">
            {role === "instructor" ? "Instructor" : "Student"} Portal
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "10px", borderRadius: "8px", width: "250px", border: "none" }}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "10px", borderRadius: "8px", width: "250px", border: "none" }}
            />

            <button type="submit" className="cta-button">Log In</button>
            <button type="button" className="cta-button" style={{ background: "gray" }} onClick={onBack}>
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
