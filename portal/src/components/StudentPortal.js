import React, { useState, useEffect } from 'react';
import { students, products, activities } from '../data/mockData';

export default function StudentPortal({ user, onLogout }) {
  const [currentView, setCurrentView] = useState('welcome');

  const fallbackStudent = students[0] || { id: -1, name: 'Student', balance: 0 };
  const [currentStudent, setCurrentStudent] = useState(
    user
      ? {
          id: user.id ?? -1,
          name: user.name ?? 'Student',
          balance: user.available_coins ?? 0,
          email: user.email,
        }
      : fallbackStudent
  );

  const [balance, setBalance] = useState(user?.available_coins ?? currentStudent.balance ?? 0);

  const studentIdForActivities = currentStudent?.id ?? -1;
  const studentActivities = activities.filter(a => a.studentId === studentIdForActivities);

  useEffect(() => {
    if (user?.available_coins != null) {
      setBalance(user.available_coins);
      setCurrentStudent(prev => ({
        ...prev,
        name: user.name ?? prev.name,
        email: user.email ?? prev.email,
        balance: user.available_coins,
        id: user.id ?? prev.id,
      }));
    }
  }, [user]);

  const refreshBalance = async () => {
    const email = user?.email || currentStudent?.email;
    if (!email) {
      alert('No email available to refresh balance.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/balance?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && typeof data.available_coins === 'number') {
        setBalance(data.available_coins);
        setCurrentStudent(prev => ({ ...prev, balance: data.available_coins }));
      } else {
        alert(data.error || 'Unable to fetch balance');
      }
    } catch {
      alert('Network error while fetching balance');
    }
  };

  const handlePurchase = (product) => {
    const have = balance;
    if (have < product.price) {
      alert('Not enough coins.');
      return;
    }
    const newBal = have - product.price;
    setBalance(newBal);
    setCurrentStudent(prev => ({ ...prev, balance: newBal }));
  };

  const NavButton = ({ id, children }) => (
    <button
      className="cta-button"
      style={{ opacity: currentView === id ? 1 : 0.8 }}
      onClick={() => setCurrentView(id)}
    >
      {children}
    </button>
  );

  return (
    <div className="app">
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
          <div className="welcome-text">Student</div>
          <h1 className="main-title">Portal</h1>

          <div style={{ textAlign: 'center', margin: '12px 0 20px 0' }}>
            <div><strong>{user?.name || currentStudent?.name || 'Student'}</strong></div>
            {(user?.email || currentStudent?.email) && (
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {user?.email || currentStudent?.email}
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 18 }}>
              Balance: <strong>{balance}</strong> Coins
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="cta-button" onClick={refreshBalance}>Refresh Balance</button>
              {onLogout && (
                <button className="cta-button" style={{ background: 'gray' }} onClick={onLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
            <NavButton id="welcome">Welcome</NavButton>
            <NavButton id="shop">Shop</NavButton>
            <NavButton id="history">Activity</NavButton>
          </div>

          {currentView === 'welcome' && (
            <section style={{ textAlign: 'center', marginTop: 10 }}>
              <p>Welcome back, {user?.name || currentStudent?.name || 'Student'}!</p>
              <p style={{ marginTop: 6 }}>Explore the shop to spend coins or view your recent activity.</p>
            </section>
          )}

          {currentView === 'shop' && (
            <section style={{ marginTop: 10 }}>
              <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Shop</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {products.map((p) => (
                  <div key={p.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, opacity: 0.9 }}>{p.description}</div>
                    <div style={{ marginTop: 8 }}>
                      Price: <strong>{p.price}</strong> Coins
                    </div>
                    <button
                      className="cta-button"
                      style={{ marginTop: 10, width: '100%' }}
                      onClick={() => handlePurchase(p)}
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentView === 'history' && (
            <section style={{ marginTop: 10 }}>
              <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Recent Activity</h2>
              {studentActivities.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.7 }}>No recent activity.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '8px 6px' }}>Date</th>
                        <th style={{ padding: '8px 6px' }}>Type</th>
                        <th style={{ padding: '8px 6px' }}>Item</th>
                        <th style={{ padding: '8px 6px' }}>Amount</th>
                        <th style={{ padding: '8px 6px' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentActivities.map((a) => (
                        <tr key={a.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '8px 6px' }}>{a.date}</td>
                          <td style={{ padding: '8px 6px' }}>{a.type}</td>
                          <td style={{ padding: '8px 6px' }}>{a.product || '-'}</td>
                          <td style={{ padding: '8px 6px' }}>{a.amount}</td>
                          <td style={{ padding: '8px 6px' }}>{a.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
