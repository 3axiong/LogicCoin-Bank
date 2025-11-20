
import React, { useState, useMemo, useEffect } from "react";
import { students as seedStudents } from "../data/mockData";

// Generic JSON helper (your existing helper)
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

export default function StudentPortal({ user, onLogout, onBack }) {
  // --- Initial student (keeps your logic, but uses same student as main if no user) ---
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

  // Keep currentStudent synced if user / initialStudent changes
  useEffect(() => {
    setCurrentStudent(initialStudent);
  }, [initialStudent]);

  // --- Load products when Products view is active ---
  useEffect(() => {
    if (currentView !== "products") return;
    setLoading(true);
    fetchJson("/products/")
      .then(setProducts)
      .catch(() => alertMsg("Failed to load products."))
      .finally(() => setLoading(false));
  }, [currentView]);

  // --- Load activities when Activities view is active ---
  useEffect(() => {
    if (!studentId || currentView !== "activities") return;
    setLoading(true);
    fetchJson(`/students/${studentId}/activities/`)
      .then(setStudentActivities)
      .catch(() => alertMsg("Failed to load activity."))
      .finally(() => setLoading(false));
  }, [currentView, studentId]);

  // --- Purchase flow (your Django-connected version) ---
  const handlePurchase = async (product) => {
    if (!currentStudent?.id) {
      alertMsg("No student found.");
      return;
    }
    if (balance < product.price) {
      alertMsg(
        `Insufficient balance! You need ${product.price} coins but only have ${balance} coins.`
      );
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

      // Update balance from server response
      setCurrentStudent((s) =>
        s ? { ...s, balance: Number(created.balance ?? s.balance ?? 0) } : s
      );
      // Prepend new activity
      setStudentActivities((prev) => [created, ...(prev || [])]);

      alertMsg(
        `Successfully purchased ${product.name} for ${product.price} coins!`
      );
      setCurrentView("activities"); // Same UX as main after purchase
    } catch (e) {
      alertMsg(e?.message || "Failed to complete purchase.");
    }
  };

  // --- Views with UI matching main branch ---

  const ProductsView = () => (
    <div>
      <h1 className="page-title">Products&apos; List</h1>
      <div
        className="balance-title"
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        Your Current Balance:{" "}
        <span className="balance-highlight">{balance} coins</span>
      </div>

      {loading && <div className="loading">Loading…</div>}

      {!loading && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-title">{product.name}</div>
              <div className="product-description">
                {String(product.description ?? "")
                  .split("\n")
                  .map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
              </div>

              {product.terms && (
                <div className="product-terms">
                  {product.terms.map((term, i) => (
                    <span key={i} className="term">
                      {term}
                    </span>
                  ))}
                </div>
              )}

              <div className="product-price-section">
                <div className="price-label">Price:</div>
                <div className="product-price">{product.price} Coins</div>
              </div>

              <button
                className={`purchase-button ${
                  balance < product.price ? "insufficient-funds" : ""
                }`}
                onClick={() => handlePurchase(product)}
                disabled={balance < product.price}
              >
                {balance < product.price ? "Insufficient Funds" : "Purchase"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ActivitiesView = () => (
    <div>
      <h1 className="page-title">Account Activities</h1>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : studentActivities.length === 0 ? (
        <div style={{ textAlign: "center", opacity: 0.7 }}>
          No recent activity.
        </div>
      ) : (
        <div className="activities-table">
          {studentActivities.map((activity) => (
            <div key={activity.id} className="activity-row">
              <div>
                {activity.date
                  ? new Date(activity.date).toLocaleDateString("en-US")
                  : ""}
              </div>
              <div>{activity.description}</div>
              <div>{activity.product}</div>
              <div>{activity.amount} coins</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const NavButton = ({ id, children }) => (
    <button className="nav-item" onClick={() => setCurrentView(id)}>
      {children}
    </button>
  );

  return (
    <div className="app">
      {/* HEADER – copied from main, wired to your state */}
      <header className="header">
        {currentView !== "welcome" && (
          <button
            className="back-button"
            onClick={() => {
              // First preference: navigate to the portal's Welcome view
              if (currentView !== "welcome") {
                setCurrentView("welcome");
                return;
              }
              // If already on welcome, defer to parent onBack if provided
              if (typeof onBack === "function") {
                return onBack();
              }
              // Otherwise try browser history then fallback to root
              if (
                typeof window !== "undefined" &&
                window.history &&
                window.history.length > 1
              ) {
                return window.history.back();
              }
              window.location.href = "/";
            }}
          >
            ← Back to Home
          </button>
        )}

        <nav className="nav-menu" style={{ margin: "0 auto" }}>
          <NavButton id="products">Use Coins</NavButton>
          <NavButton id="activities">Account Activities</NavButton>
          <button className="nav-item">Contact Instructor</button>
          {onLogout && (
            <button className="nav-item" onClick={onLogout}>
              Logout
            </button>
          )}
        </nav>

        <div className="coin-balance">
          <span className="amount">{balance}</span>
          coins
        </div>
      </header>

      {/* Your notice bar, doesn't affect layout */}
      {notice && (
        <div
          className="alert"
          onClick={clearMsg}
          style={{ margin: "8px 16px" }}
        >
          {notice}
        </div>
      )}

      {/* WELCOME PAGE – same layout/classes as main */}
      {currentView === "welcome" && (
        <div className="main-content">
          <div className="left-section">
            <div className="logo-section">
              <div className="logo-circle">
                <div className="logo-text">ASU LOGO</div>
                <div className="globe-icon" aria-hidden>
                  🌐
                </div>
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
      )}

      {/* PRODUCTS + ACTIVITIES PAGES – wrapped in same containers as main */}
      {currentView === "products" && (
        <div className="products-container">
          <ProductsView />
        </div>
      )}

      {currentView === "activities" && (
        <div className="activities-container">
          <ActivitiesView />
        </div>
      )}
    </div>
  );
}
