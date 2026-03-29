import React, { useState, useEffect } from 'react';
import { fetchJson } from "./api";


export default function StudentPortal({ user, onLogout, onBack }) {
  const [dbProducts, setDbProducts] = useState([]);
  const [dbActivities, setDbActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentView, setCurrentView] = useState(() => {
  return localStorage.getItem("logiccoin_student_view") || "welcome";});

  // default student
  const defaultStudent = { id: -1, name: 'Student', balance: 0 };
  const [currentStudent, setCurrentStudent] = useState(
    user
      ? {
          id: user.id ?? defaultStudent.id,
          name: user.name ?? defaultStudent.name,
          balance: user.available_coins ?? defaultStudent.balance,
          email: user.email ?? defaultStudent.email,
        }
      : defaultStudent
  );

  const [balance, setBalance] = useState(currentStudent.balance ?? 0);
  useEffect(() => {
    if (currentView !== "products") return;
    setLoading(true);
    fetchJson("/api/products/")
      .then(setDbProducts)
      .finally(() => setLoading(false));
  }, [currentView]);

  useEffect(() => {
    if (currentView !== "activities") return;
    if (!currentStudent?.id || currentStudent.id === -1) return;
    setLoading(true);
    fetchJson(`/api/students/${currentStudent.id}/activities/`)
      .then(setDbActivities)
      .finally(() => setLoading(false));
  }, [currentView, currentStudent?.id]);

  useEffect(() => {
  localStorage.setItem("logiccoin_student_view", currentView);}, [currentView]);

  useEffect(() => {
    if (user) {
      setCurrentStudent(prev => ({
        ...prev,
        id: user.id ?? prev.id,
        name: user.name ?? prev.name,
        email: user.email ?? prev.email,
        balance: user.available_coins ?? prev.balance,
      }));
      if (user.available_coins != null) setBalance(user.available_coins);
    }
  }, [user]);


  const handlePurchase = async (product) => {
    try {
      if ((balance ?? 0) < product.price) {
        alert(`Insufficient balance! You need ${product.price} coins but only have ${balance} coins.`);
        return;
      }

      setLoading(true);

      const created = await fetchJson("/api/purchases/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          productId: product.id,
          quantity: 1,
          description: `Purchase-${Date.now()}`,
        }),
      });

      // update UI from server response
      setBalance(created.balance);
      setCurrentStudent(prev => ({ ...prev, balance: created.balance }));

      // prepend new activity into UI list
      setDbActivities(prev => [created, ...(prev || [])]);

      alert(`Successfully purchased ${product.name} for ${product.price} coins!`);
      setCurrentView("activities");
    } catch (e) {
      alert(e?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };


  // Welcome, Products and Activities views adapted from test.js
const WelcomeView = () => (
  <section className="portal-message">
    <p>Welcome back, {user?.name || currentStudent?.name || 'Student'}!</p>
    <p>Explore the shop to spend coins or view your recent activity.</p>
  </section>
);

  const ProductsView = () => (
    <div>
      <h1 className="page-title">Products list</h1>
      <div className="balance-title">
        Your Current Balance: <span className="balance-highlight">{balance} coins</span>
      </div>
      <div className="products-grid">
        {dbProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-title">{product.name}</div>
            <div className="product-description">
              {product.description?.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
            {product.terms && (
              <div className="product-terms">
                {product.terms.map((term, i) => (
                  <span key={i} className="term">{term}</span>
                ))}
              </div>
            )}
            <div className="product-price-section">
              <div className="price-label">Price:</div>
              <div className="product-price">{product.price} Coins</div>
            </div>
            <button
              className={`purchase-button ${(balance ?? 0) < product.price ? 'insufficient-funds' : ''}`}
              onClick={() => handlePurchase(product)}
              disabled={(balance ?? 0) < product.price || loading}
            >
              {(balance ?? 0) < product.price ? 'Insufficient Funds' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const ActivitiesView = () => {
    const list = dbActivities;

    return (
      <div>
        <h1 className="page-title">Account activities</h1>

        {loading ? (
          <div className="status-message">Loading…</div>
        ) : list.length === 0 ? (
          <div className="status-message muted">No recent activity.</div>
        ) : (
          <div className="activities-table">
            {list.map(activity => (
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
  };


  const NavButton = ({ id, children }) => (
    <button
      className="nav-item"
      onClick={() => setCurrentView(id)}
    >
      {children}
    </button>
  );

  return (
    <div className="app">
      {/* Header (matches test.js) */}
      <header className="header">
        {currentView !== 'welcome' && (
          <button
            className="back-button"
            onClick={() => {
              // First preference: navigate to the portal's Welcome view
              if (currentView !== 'welcome') {
                setCurrentView('welcome');
                return;
              }
              // If already on welcome, defer to parent onBack if provided
              if (typeof onBack === 'function') {
                return onBack();
              }
              // Otherwise try browser history then fallback to root
              if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
                return window.history.back();
              }
              window.location.href = '/';
            }}
          >
            ← Back to Home
          </button>
        )}

        <nav className="nav-menu centered">
          <NavButton id="products">Use Coins</NavButton>
          <NavButton id="activities">Account Activities</NavButton>
          {onLogout && (
            <button
              className="nav-item"
              onClick={() => {
                localStorage.removeItem("logiccoin_student_view");
                onLogout();
              }}
            >
              Logout
            </button>
          )}
        </nav>

        <div className="coin-balance">
          <span className="amount">{balance}</span>
          coins
        </div>
      </header>

      {/* Pages */}
      {currentView === 'welcome' && (
        <div className="main-content">
          <div className="left-section">
            <div className="logo-section">
            <div className="logo-circle">
              <img src="/asu_logo.png" alt="ASU logo" className="logo-image" />
            </div>
            </div>
          </div>

          <div className="right-section">
            <div className="welcome-text">Welcome to</div>
            <h1 className="main-title">LogicCoin<br/>Bank Portal</h1>

            <div className="center-balance">
              <div className="balance-label">Your Balance</div>
              <div className="balance-amount">{balance}</div>
              <div className="balance-currency">coins</div>
            </div>

            <div className="welcome-cta-row">
              <button className="cta-button" onClick={() => setCurrentView('products')}>Use coins</button>
            </div>

          </div>
        </div>
      )}

      {currentView === 'products' && <div className="products-container"><ProductsView /></div>}

      {currentView === 'activities' && <div className="activities-container"><ActivitiesView /></div>}
    </div>
  );
}
