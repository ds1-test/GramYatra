import React, { useState, useEffect, useCallback } from 'react';
import AuthForm from './components/AuthForm';
import HomeScreen from './screens/HomeScreen';
import DriverDashboard from './components/DriverDashboard';
import WelcomeScreen from './screens/WelcomeScreen';
import { Language } from './translations';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import StarField from './components/StarField';

export type User = {
  username: string;
  identifier: string;
};

export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  /** -----------------------------
   *  State Management
   * ----------------------------- */
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'user' | 'driver' | null>(null);

  /** -----------------------------
   *  Effects
   * ----------------------------- */
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  /** -----------------------------
   *  Handlers
   * ----------------------------- */
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const handleSignInSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleSignOut = () => {
    setUser(null);
    setAuthMode(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberedEmail');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleBack = () => setAuthMode(null);

  /** -----------------------------
   *  Content Rendering
   * ----------------------------- */
  const renderScreen = () => {
    if (user && authMode === 'user') {
      return (
        <HomeScreen
          user={user}
          onSignOut={handleSignOut}
          onUpdateUser={handleUpdateUser}
          theme={theme}
          toggleTheme={toggleTheme}
          language={language}
          setLanguage={handleSetLanguage}
        />
      );
    }
    if (user && authMode === 'driver') {
      return (
        <DriverDashboard
          user={user}
          onSignOut={handleSignOut}
          theme={theme}
          language={language}
        />
      );
    }
    if (authMode) {
      return (
        <AuthForm
          mode={authMode}
          onSignInSuccess={handleSignInSuccess}
          onBack={handleBack}
          theme={theme}
          language={language}
        />
      );
    }
    return (
      <WelcomeScreen
        onSelectRole={setAuthMode}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={handleSetLanguage}
      />
    );
  };

  const isHomeScreen = user && authMode === 'user';
  const showStarField = !user;

  return (
    <ToastProvider>
        {showStarField && <StarField theme={theme} />}
        <main className="w-screen h-screen flex flex-col relative z-10">
          {isHomeScreen ? (
            renderScreen()
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              {renderScreen()}
            </div>
          )}
        </main>
        <ToastContainer />
    </ToastProvider>
  );
};

export default App;