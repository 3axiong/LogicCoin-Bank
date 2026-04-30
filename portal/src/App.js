import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import StudentPortal from './components/StudentPortal';
import InstructorPortal from './components/InstructorPortal';
import ASULeaderboard from "./components/ASULeaderboard";
import LoginScreen from "./components/LoginScreen";
import ASUShell from "./components/ASUShell";
import InstructorRegistrationLogin from "./components/InstructorRegistrationLogin";
import InstructorRegistration from "./components/InstructorRegistration";

function HomeScreen() {
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('logiccoin_user'); //TODO: Possibly need to change using local server and use server session for real login state
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
    <ASUShell>
      <StudentPortal
        user={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('logiccoin_user');
          setView('home');
        }}
      />
    </ASUShell>
  );

  if (view === 'instructor') return (
    <ASUShell>
      <InstructorPortal
        user={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('logiccoin_user');
          setView('home');
        }}
      />
    </ASUShell>
  );


  if (view === 'login') {
    return (
      <ASUShell>
        <LoginScreen
          role={role}
          onBack={() => setView('home')}
          onLogin={(data) => {
            setCurrentUser(data);
            localStorage.setItem('logiccoin_user', JSON.stringify(data));
            setView(data.role);
          }}
        />
      </ASUShell>
    );
  }

  return (
    <ASUShell>
      <div className="app">
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
            <h1 className="main-title">
              LogicCoin<br />
              Bank
            </h1>
            <div className="welcome-cta-row">
              <button
                className="cta-button"
                onClick={() => { setRole('student'); setView('login'); }}
              >
                Student portal
              </button>
              <button
                className="cta-button"
                onClick={() => { setRole('instructor'); setView('login'); }}
              >
                Instructor portal
              </button>
            </div>
          </div>
        </div>
        <ASULeaderboard />
      </div>
    </ASUShell>
  );
}

function InstructorRegistrationRoute() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);

  return (
    <ASUShell>
      {unlocked ? (
        <InstructorRegistration
          onBack={() => navigate('/')}
          onRegister={() => navigate('/')}
        />
      ) : (
        <InstructorRegistrationLogin
          onBack={() => navigate('/')}
          onLogin={() => setUnlocked(true)}
        />
      )}
    </ASUShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/staff/instructor-registration" element={<InstructorRegistrationRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
