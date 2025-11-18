import React, { useState, useMemo, useEffect } from "react";
import { students as seedStudents, activities as seedActivities } from "../data/mockData";
// import fetchJson from wherever you defined it
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}
export default function StudentPortal({ user, onLogout, onBack }) {
  const initialStudent = useMemo(() => {
    if (user && (user.id ?? user.email)) {
      return {
        id: user.id ?? -1,
        name: user.name ?? "Student",
        email: user.email ?? "",
        balance: Number(user.available_coins ?? user.balance ?? 0),
      };
    }
    const fallback = seedStudents?.[0];
    if (fallback) {
      return {
        ...fallback,
        balance: Number(fallback.balance ?? 0),
      };
    }

    return {
      id: -1,
      name: "Student",
      email: "",
      balance: 0,
    };
  }, [user]);

  const [currentView, setCurrentView] = useState("welcome");
  const [currentStudent, setCurrentStudent] = useState(initialStudent);

  const [products, setProducts] = useState([]);
  const [studentActivities, setStudentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const alertMsg = (m) => setNotice(m);
  const clearMsg = () => setNotice("");

  const balance = currentStudent?.balance ?? 0;
  const studentId = currentStudent?.id ?? -1;

  // --- Load products when needed ---
  useEffect(() => {
    if (currentView !== "products") return;
    setLoading(true);
    fetchJson("/products/")
      .then(setProducts)
      .catch(() => alertMsg("Failed to load products."))
      .finally(() => setLoading(false));
  }, [currentView]);

  // --- Load activities when needed ---
  useEffect(() => {
    if (!studentId || currentView !== "activities") return;
    setLoading(true);
    fetchJson(`/students/${studentId}/activities/`)
      .then(setStudentActivities)
      .catch(() => alertMsg("Failed to load activity."))
      .finally(() => setLoading(false));
  }, [currentView, studentId]);

  // --- Purchase flow connected to Django ---
  const handlePurchase = async (product) => {
    if (!currentStudent?.id) {
      alertMsg("No student found.");
      return;
    }
    if (balance < product.price) {
      alertMsg("Insufficient funds.");
      return;
    }

    try {
      const created = await fetchJson("/purchases/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          productId: product.id,
          quantity: 1,
          description: `INV-${Date.now()}`,
        }),
      });

      // Update balance and activity list using server response
      setCurrentStudent((s) =>
        s ? { ...s, balance: Number(created.balance ?? s.balance ?? 0) } : s
      );
      setStudentActivities((prev) => [created, ...(prev || [])]);
      alertMsg(`Purchased "${product.name}" for ${product.price} coins.`);
    } catch (e) {
      alertMsg(e?.message || "Failed to complete purchase.");
    }
  };

  // ---- Views ----
  const WelcomeView = () => (
    <div className="main-content">
      <div className="left-section">
        <div className="logo-section">
          <div className="logo-circle">
            <div className="logo-text">ASU LOGO</div>
            <div className="globe-icon">🌐</div>
          </div>

          <div className="right-section">
            <div className="welcome-text">Welcome To</div>
            <h1 className="main-title">
              LogicCoin
              <br />
              Bank Portal
            </h1>

            <div className="center-balance">
              <div className="balance-label">Your Balance</div>
              <div className="balance-amount">{balance}</div>
              <div className="balance-currency">coins</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                className="cta-button"
                onClick={() => setCurrentView("products")}
              >
                Use coins
              </button>
            </div>

            <div className="page-indicators" />
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="welcome-text">Welcome To</div>
        <h1 className="main-title">
          LogicCoin
          <br />
          Bank Portal
        </h1>

        <div className="center-balance">
          <div className="balance-label">Your Balance</div>
          <div className="balance-amount">{balance}</div>
          <div className="balance-currency">coins</div>
        </div>

        <button
          className="cta-button"
          onClick={() => setCurrentView("products")}
        >
          Use coins
        </button>
      </div>
    </div>
  );

  const ProductsView = () => (
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
        <div className="welcome-text">Use your coins on</div>
        <h1 className="main-title">Available Products</h1>

        {loading && <div className="loading">Loading…</div>}
        {!loading && (
          <div className="product-grid">
            {products.map((product) => {
              const hasFunds = balance >= product.price;
              return (
                <div key={product.id} className="product-card">
                  <div className="product-name">{product.name}</div>
                  <div className="product-description">
                    {product.description}
                  </div>

                  <div className="product-terms">
                    {product.terms?.map((term, i) => (
                      <span key={i} className="term">
                        {term}
                      </span>
                    ))}
                  </div>

                  <div className="product-price-section">
                    <div className="price-label">Price:</div>
                    <div className="product-price">
                      {product.price} Coins
                    </div>
                  </div>

                  <button
                    className={`purchase-button ${
                      hasFunds ? "" : "insufficient-funds"
                    }`}
                    onClick={() => handlePurchase(product)}
                    disabled={!hasFunds}
                  >
                    {hasFunds ? "Purchase" : "Insufficient Funds"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="product-actions">
          <button
            className="cta-button"
            onClick={() => setCurrentView("activities")}
          >
            View activity
          </button>
        </div>
      </div>
    </div>
  );

  const ActivitiesView = () => (
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
        <div className="welcome-text">Recent</div>
        <h1 className="main-title">Activity</h1>

        {loading && <div className="loading">Loading…</div>}

        {!loading && (studentActivities?.length ?? 0) === 0 ? (
          <div className="empty-activity">No activity yet.</div>
        ) : (
          !loading && (
            <div className="activity-list">
              {studentActivities.map((a) => (
                <div key={a.id} className="activity-item">
                  <div className="activity-name">{a.product}</div>
                  <div className="activity-meta">
                    <span>{new Date(a.date).toLocaleString()}</span>
                    <span>-{a.amount} coins</span>
                    {a.refunded && (
                      <span className="term refunded">Refunded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        <div className="product-actions">
          <button
            className="cta-button"
            onClick={() => setCurrentView("welcome")}
          >
            Back to welcome
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <header
        className="top-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {onBack && (
            <button
              className="cta-button"
              style={{ background: "#777" }}
              onClick={onBack}
            >
              Back
            </button>
          )}
        </div>

        <div className="coin-balance" style={{ fontWeight: 600 }}>
          Coins: <span className="amount">{balance}</span>
        </div>

        <div>
          {onLogout && (
            <button
              className="cta-button"
              style={{ background: "#b71c1c" }}
              onClick={onLogout}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {notice && (
        <div
          className="alert"
          onClick={clearMsg}
          style={{ margin: "8px 16px" }}
        >
          {notice}
        </div>
      )}

      {currentView === "welcome" && <WelcomeView />}
      {currentView === "products" && <ProductsView />}
      {currentView === "activities" && <ActivitiesView />}
    </div>
  );
}
