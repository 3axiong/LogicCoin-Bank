import React, { useState } from "react";

export default function InstructorRegistrationLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Get password from environment variable with fallback
    const correctPassword = process.env.REACT_APP_INSTRUCTOR_REGISTRATION_PASSWORD || "password123";
    if (password === correctPassword) {
      onLogin?.();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Instructor Registration</h2>
        <p className="login-subtitle">Enter the registration password to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="cta-button" style={{ width: "100%" }}>
            Access Registration
          </button>
        </form>

        <button
          onClick={onBack}
          className="back-button"
          style={{
            marginTop: "15px",
            width: "100%",
            backgroundColor: "#f0f0f0",
            color: "#333",
            border: "1px solid #ddd",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
