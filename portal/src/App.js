import React, { useState } from 'react';
import './App.css';
import StudentPortal from './components/StudentPortal';
import InstructorPortal from './components/InstructorPortal';
import ASULeaderboard from "./components/ASULeaderboard";
import LoginScreen from "./components/LoginScreen";

function App() {
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('logiccoin_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role || 'home';
      } catch (e) {
        return 'home';
      }
    }
    return 'home';
  });
  //const [view, setView] = useState('home');
  const [role, setRole] = useState(null);
  //const [currentUser, setCurrentUser] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('logiccoin_user');
    return saved ? JSON.parse(saved) : null;
  });

  if (view === 'student') return (
    <StudentPortal user={currentUser} onLogout={() => { setCurrentUser(null); localStorage.removeItem('logiccoin_user'); setView('home'); }} />
  );

  if (view === 'instructor') return (
    <InstructorPortal user={currentUser} onLogout={() => { setCurrentUser(null); localStorage.removeItem('logiccoin_user'); setView('home'); }} />
  );


  if (view === 'login') {
    return (
      <LoginScreen
        role={role}
        onBack={() => setView('home')}
        onLogin={(data) => {
          setCurrentUser(data);
          localStorage.setItem('logiccoin_user', JSON.stringify(data));
          setView(data.role);              
        }}
      />
    );
  }

  return (
    <div className="app">
      <div className="main-content">
        <div className="left-section">
          <div className="logo-section">
            <div className="logo-circle">
              <img src="/asu_logo.png" alt="ASU Logo" className="logo-image" />
              <div className="globe-icon">🌐</div>
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="welcome-text">Welcome To</div>
          <h1 className="main-title">
            LogicCoin<br />
            Bank
          </h1>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button 
              className="cta-button" 
              onClick={() => { setRole('student'); setView('login'); }}
            >
              Student Portal
            </button>
            <button 
              className="cta-button" 
              onClick={() => { setRole('instructor'); setView('login'); }}
            >
              Instructor Portal
            </button>
          </div>
        </div>
      </div>
      <ASULeaderboard />
    </div>
  );
}

export default App;
