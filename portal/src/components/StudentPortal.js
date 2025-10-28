import React, { useState, useEffect } from 'react';
import { students, products, activities } from '../data/mockData';

export default function StudentPortal({ user, onBack, onLogout }) {
  const initialStudent = user
    ? {
        id: user.id ?? -1,
        name: user.name ?? 'Student',
        email: user.email,
        balance: user.available_coins ?? 0,
      }
    : (students && students[0]) || { id: -1, name: 'Student', balance: 0 };

  const [currentView, setCurrentView] = useState('welcome'); 
  const [currentStudent, setCurrentStudent] = useState(initialStudent);

  const studentActivities = activities.filter(
    (a) => a.studentId === currentStudent.id
  );

  const handlePurchase = (product) => {
    if (currentStudent.balance < product.price) {
      alert('Insufficient funds');
      return;
    }
    const updated = {
      ...currentStudent,
      balance: currentStudent.balance - product.price,
    };
    setCurrentStudent(updated);
    alert(`Purchased "${product.name}" for ${product.price} coins!`);

  };

  const WelcomeView = () => (
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
        <div className="welcome-text">Welcome To</div>
        <h1 className="main-title">
          LogicCoin
          <br />
          Bank Portal
        </h1>

        <div className="center-balance">
          <div className="balance-label">Your Balance</div>
          <div className="balance-amount">{currentStudent.balance}</div>
          <div className="balance-currency">coins</div>
        </div>

        <button className="cta-button" onClick={() => setCurrentView('products')}>
          Use coins
        </button>
      </div>

      <div className="page-indicators">
        <div className="indicator active"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
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

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-name">{product.name}</div>
              <div className="product-description">{product.description}</div>

              <div className="product-terms">
                {product.terms?.map((term, i) => (
                  <span key={i} className="term">
                    {term}
                  </span>
                ))}
              </div>

              <div className="product-price-section">
                <div className="price-label">Price:</div>
                <div className="product-price">{product.price} Coins</div>
              </div>

              <button
                className={`purchase-button ${
                  currentStudent.balance < product.price ? 'insufficient-funds' : ''
                }`}
                onClick={() => handlePurchase(product)}
                disabled={currentStudent.balance < product.price}
              >
                {currentStudent.balance < product.price ? 'Insufficient Funds' : 'Purchase'}
              </button>

              <div className="page-indicators">
                <div className="indicator"></div>
                <div className="indicator active"></div>
                <div className="indicator"></div>
                <div className="indicator"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="product-actions">
          <button className="cta-button" onClick={() => setCurrentView('activities')}>
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

        {studentActivities.length === 0 ? (
          <div className="empty-activity">No activity yet.</div>
        ) : (
          <div className="activity-list">
            {studentActivities.map((a) => (
              <div key={a.id} className="activity-item">
                <div className="activity-name">{a.title}</div>
                <div className="activity-meta">
                  <span>{a.date}</span>
                  <span>{a.delta > 0 ? `+${a.delta}` : a.delta} coins</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="product-actions">
          <button className="cta-button" onClick={() => setCurrentView('welcome')}>
            Back to welcome
          </button>
        </div>

        <div className="page-indicators">
          <div className="indicator"></div>
          <div className="indicator"></div>
          <div className="indicator active"></div>
          <div className="indicator"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <header
        className="top-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {onBack && (
            <button className="cta-button" style={{ background: '#777' }} onClick={onBack}>
              Back
            </button>
          )}
        </div>

        <div className="coin-balance" style={{ fontWeight: 600 }}>
          Coins: <span className="amount">{currentStudent.balance}</span>
        </div>

        <div>
          {onLogout && (
            <button className="cta-button" style={{ background: '#b71c1c' }} onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      {currentView === 'welcome' && <WelcomeView />}
      {currentView === 'products' && <ProductsView />}
      {currentView === 'activities' && <ActivitiesView />}
    </div>
  );
}
