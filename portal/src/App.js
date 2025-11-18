import React, { useState } from 'react';
import './App.css';
import StudentPortal from './components/StudentPortal';
import InstructorPortal from './components/InstructorPortal';
import ASULeaderboard from "./components/ASULeaderboard";
import LoginScreen from "./components/LoginScreen";

function App() {
  const [view, setView] = useState('home');
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  if (view === 'student') return (
    <StudentPortal user={currentUser} onBack={() => setView('home')} onLogout={() => { setCurrentUser(null); setView('home'); }} />
  );

  if (view === 'instructor') return (
    <InstructorPortal user={currentUser} onLogout={() => { setCurrentUser(null); setView('home'); }} />
  );


  if (view === 'login') {
    return (
      <LoginScreen
        role={role}
        onBack={() => setView('home')}
        onLogin={(data) => {
          setCurrentUser(data);            
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
              // onClick={() => { setRole('instructor'); setView('login'); }}
              onClick={() => { setRole('instructor'); setView('instructor'); }}
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
