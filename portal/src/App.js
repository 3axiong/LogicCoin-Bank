import React, { useState } from 'react';
import './App.css';
import StudentPortal from './components/StudentPortal';
import InstructorPortal from './components/InstructorPortal';
import ASULeaderboard from "./components/ASULeaderboard";
import LoginScreen from "./components/LoginScreen";

function App() {
  const [view, setView] = useState('home');
  const [role, setRole] = useState(null);

  if (view === 'student') return <StudentPortal />;
  if (view === 'instructor') return <InstructorPortal />;

  if (view === 'login') {
    return (
      <LoginScreen
        role={role}
        onBack={() => setView('home')}
        onLogin={() => setView(role)}
      />
    );
  }

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
              Faculty Portal
            </button>
          </div>
        </div>
      </div>
      <ASULeaderboard />
    </div>
  );
}

export default App;
