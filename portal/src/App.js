import React, { useState } from 'react';
import './App.css';
import StudentPortal from './components/StudentPortal';
import InstructorPortal from './components/InstructorPortal';

function App() {
  const [userType, setUserType] = useState(null); // 'student' or 'instructor'

  const LoginView = () => (
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
              onClick={() => setUserType('student')}
            >
              Student Portal
            </button>
            <button 
              className="cta-button" 
              onClick={() => setUserType('instructor')}
            >
              Faculty Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (userType === 'student') {
    return <StudentPortal onBack={() => setUserType(null)} />;
  }
  
  if (userType === 'instructor') {
    return <InstructorPortal onBack={() => setUserType(null)} />;
  }

  return <LoginView />;
}

export default App;
