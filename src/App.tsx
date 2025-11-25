import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { SkatersManagement } from './components/SkatersManagement';
import { SkaterProfile } from './components/SkaterProfile';
import { CreateSkater } from './components/CreateSkater';
import { SessionsManagement } from './components/SessionsManagement';
import { SessionDetails } from './components/SessionDetails';
import { InstructorProfile } from './components/InstructorProfile';

type Screen = 'login' | 'dashboard' | 'skaters' | 'profile' | 'createSkater' | 'sessions' | 'sessionDetails' | 'instructorProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedSkaterId, setSelectedSkaterId] = useState<number | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
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

  const handleNavigateToCreateSkater = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('createSkater');
  };

  const handleNavigateToSessions = () => {
    setPreviousScreen('dashboard');
    setCurrentScreen('sessions');
  };

  const handleNavigateToSessionDetails = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setPreviousScreen(currentScreen);
    setCurrentScreen('sessionDetails');
  };

  const handleNavigateToInstructorProfile = () => {
    setPreviousScreen('dashboard');
    setCurrentScreen('instructorProfile');
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {currentScreen === 'login' && <Login onLogin={handleLogin} />}

      {currentScreen === 'dashboard' && (
        <Dashboard
          onNavigateToSkaters={handleNavigateToSkaters}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToSessions={handleNavigateToSessions}
          onNavigateToSessionDetails={handleNavigateToSessionDetails}
          onNavigateToInstructorProfile={handleNavigateToInstructorProfile}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'skaters' && (
        <SkatersManagement
          onBack={handleBackToDashboard}
          onViewProfile={handleNavigateToProfile}
          onCreateSkater={handleNavigateToCreateSkater}
        />
      )}

      {currentScreen === 'createSkater' && (
        <CreateSkater onBack={handleBackNavigation} />
      )}

      {currentScreen === 'profile' && selectedSkaterId && (
        <SkaterProfile
          skaterId={selectedSkaterId}
          onBack={handleBackNavigation}
        />
      )}

      {currentScreen === 'sessions' && (
        <SessionsManagement
          onBack={handleBackToDashboard}
          onViewSession={handleNavigateToSessionDetails}
        />
      )}

      {currentScreen === 'sessionDetails' && selectedSessionId && (
        <SessionDetails
          sessionId={selectedSessionId}
          onBack={handleBackNavigation}
        />
      )}

      {currentScreen === 'instructorProfile' && (
        <InstructorProfile onBack={handleBackToDashboard} />
      )}
    </>
  );
}