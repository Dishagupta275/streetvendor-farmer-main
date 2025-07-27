import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import SellerDashboard from './components/SellerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import { getCurrentUser } from './utils/storage';
import { User } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setCurrentView('dashboard');
    }
  }, []);

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleAuthModeChange = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setCurrentView('auth');
  };

  if (currentView === 'landing') {
    return <LandingPage onAuthModeChange={handleAuthModeChange} />;
  }

  if (currentView === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setCurrentView('landing')}
        onModeChange={setAuthMode}
      />
    );
  }

  if (currentView === 'dashboard' && user) {
    return user.userType === 'seller' ? (
      <SellerDashboard user={user} onLogout={handleLogout} />
    ) : (
      <BuyerDashboard user={user} onLogout={handleLogout} />
    );
  }

  return <LandingPage onAuthModeChange={handleAuthModeChange} />;
}

export default App;