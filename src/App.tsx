import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { SkatersManagement } from './components/SkatersManagement';
import { SkaterProfile } from './components/SkaterProfile';

type Screen = 'login' | 'dashboard' | 'skaters' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedSkaterId, setSelectedSkaterId] = useState<number | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('dashboard');

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  const handleNavigateToSkaters = () => {
    setPreviousScreen('dashboard');
    setCurrentScreen('skaters');
  };

  const handleNavigateToProfile = (skaterId: number) => {
    setSelectedSkaterId(skaterId);
    const currentScreenForBack = currentScreen;
    setPreviousScreen(currentScreenForBack);
    setCurrentScreen('profile');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleBackNavigation = () => {
    if (previousScreen === 'skaters') {
      setCurrentScreen('skaters');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  if (currentScreen === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  if (currentScreen === 'dashboard') {
    return (
      <Dashboard
        onNavigateToSkaters={handleNavigateToSkaters}
        onNavigateToProfile={handleNavigateToProfile}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'skaters') {
    return (
      <SkatersManagement
        onBack={handleBackToDashboard}
        onViewProfile={handleNavigateToProfile}
      />
    );
  }

  if (currentScreen === 'profile' && selectedSkaterId) {
    return (
      <SkaterProfile
        skaterId={selectedSkaterId}
        onBack={handleBackNavigation}
      />
    );
  }

  return null;
}
