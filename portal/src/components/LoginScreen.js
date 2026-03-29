import React, { useState } from "react";

export default function LoginScreen({ role, onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //MOCK DATA
  const USE_MOCK = true;

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (USE_MOCK) {
    if (role === "student") {
      onLogin?.({
        id: 1,
        name: "Bob",
        email: email || "bob@test.com",
        available_coins: 300,
        role: "student" 
      });
    } else {
      onLogin?.({
        id: 99,
        name: "Instructor",
        email: email || "instructor@test.com",
        role: "instructor"
      });
    }
    return;
  }


  try {
    const res = await fetch("/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      alert(data.error || "Login failed");
      return;
    }

    onLogin?.(data); 
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
};

  return (
    <div className="app">
      <div className="main-content">
        <div className="left-section">
          <div className="logo-section">
            <div className="logo-circle">
              <img src="/asu_logo.png" alt="ASU logo" className="logo-image" />
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="welcome-text">Login</div>
          <h1 className="main-title">
            {role === "instructor" ? "Instructor" : "Student"} Portal
          </h1>

          <form onSubmit={handleSubmit} className="login-form">
            <label className="form-label">
              Email
              <input
                type="email"
                className="form-input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="form-label">
              Password
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="login-actions">
              <button type="submit" className="cta-button">
                Log in
              </button>
              <button
                type="button"
                className="cta-button login-back-button"
                onClick={onBack}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
