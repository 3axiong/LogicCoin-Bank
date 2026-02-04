import React, { useState, useEffect } from 'react';
//import { students, products, activities } from '../data/mockData';

export default function StudentPortal({ user, onLogout, onBack }) {
  const [currentView, setCurrentView] = useState(() => {
  return localStorage.getItem("logiccoin_student_view") || "welcome";});

  // default student (Bob) if no user provided
  const defaultStudent = students[0] || { id: -1, name: 'Student', balance: 0 };
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

  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
  localStorage.setItem("logiccoin_student_view", currentView);}, [currentView]);

  useEffect(() => {
    if (user) {
      setCurrentStudent((prev) => ({
        ...prev,
        id: user.id ?? prev.id,
        name: user.name ?? prev.name,
        email: user.email ?? prev.email,
        balance: user.available_coins ?? prev.balance,
      }));
      if (user.available_coins != null) setBalance(user.available_coins);
    }
  }, [user]);


  useEffect(() => {
    const load = async () => {
      if (!currentStudent?.id || currentStudent.id === -1) return;

      try {
        setLoading(true);
        setError("");

        const prodRes = await fetch("http://localhost:8000/products/");
        const prodJson = await prodRes.json();
        if (!prodRes.ok) throw new Error(prodJson?.error || "Failed to load products");
        setProducts(Array.isArray(prodJson) ? prodJson : []);

        const actRes = await fetch(
          `http://localhost:8000/students/${currentStudent.id}/activities/`
        );
        const actJson = await actRes.json();
        if (!actRes.ok) throw new Error(actJson?.error || "Failed to load activities");
        setActivities(Array.isArray(actJson) ? actJson : []);
      } catch (e) {
        setError(e.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentStudent?.id]);

  //const studentActivities = activities.filter(a => a.studentId === currentStudent.id);
  const studentActivities = activities;

  const handlePurchase = async (product) => {
    if ((balance ?? 0) < product.price) {
      alert(
        `Insufficient balance! You need ${product.price} coins but only have ${balance} coins.`
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:8000/purchases/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: currentStudent.id,
          productId: product.id,
          quantity: 1,
          description: `Purchase ${product.name}`,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Purchase failed");
      }

      const newBalance = json.balance;

      setBalance(newBalance);
      setCurrentStudent((prev) => ({
        ...prev,
        balance: newBalance,
      }));

      const actRes = await fetch(
        `http://localhost:8000/students/${currentStudent.id}/activities/`
      );
      const actJson = await actRes.json();

      if (actRes.ok) {
        setActivities(Array.isArray(actJson) ? actJson : []);
      }

      alert(`Successfully purchased ${product.name} for ${product.price} coins!`);
      setCurrentView("activities");
    } catch (e) {
      alert(e.message || "Purchase error");
    } finally {
      setLoading(false);
    }
  };

  // Welcome, Products and Activities views adapted from test.js
  const WelcomeView = () => (
    <section style={{ textAlign: 'center', marginTop: 10 }}>
      <p>Welcome back, {user?.name || currentStudent?.name || 'Student'}!</p>
      <p style={{ marginTop: 6 }}>Explore the shop to spend coins or view your recent activity.</p>
      {/* single Use Coins button is provided via the nav; keep layout clean here */}
    </section>
  );

  const ProductsView = () => (
    <div>
      <h1 className="page-title">Products' List</h1>
      <div className="balance-title" style={{ textAlign: 'center', marginBottom: 20 }}>
        Your Current Balance: <span className="balance-highlight">{balance} coins</span>
      </div>
      <div className="products-grid">
        {products.map(product => (
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
              disabled={(balance ?? 0) < product.price}
            >
              {(balance ?? 0) < product.price ? 'Insufficient Funds' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const ActivitiesView = () => (
    <div>
      <h1 className="page-title">Account Activities</h1>
      {studentActivities.length === 0 ? (
        <div style={{ textAlign: 'center', opacity: 0.7 }}>No recent activity.</div>
      ) : (
        <div className="activities-table">
          {studentActivities.map(activity => (
            <div key={activity.id} className="activity-row">
              <div>{activity.date}</div>
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

        <nav className="nav-menu" style={{ margin: '0 auto' }}>
          <NavButton id="products">Use Coins</NavButton>
          <NavButton id="activities">Account Activities</NavButton>
          <button className="nav-item">Contact Instructor</button>
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
                <div className="logo-text">ASU LOGO</div>
                <div className="globe-icon" aria-hidden>🌐</div>
              </div>
            </div>
          </div>

          <div className="right-section">
            <div className="welcome-text">Welcome To</div>
            <h1 className="main-title">LogicCoin<br/>Bank Portal</h1>

            <div className="center-balance">
              <div className="balance-label">Your Balance</div>
              <div className="balance-amount">{balance}</div>
              <div className="balance-currency">coins</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button className="cta-button" onClick={() => setCurrentView('products')}>Use coins</button>
            </div>

            <div className="page-indicators" />
          </div>
        </div>
      )}

      {currentView === 'products' && <div className="products-container"><ProductsView /></div>}

      {currentView === 'activities' && <div className="activities-container"><ActivitiesView /></div>}
    </div>
  );
}
