import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import { Login } from './components/Login';
import App from './components/App';
import { ToastContainer } from './components/Toast';

const msalInstance = new PublicClientApplication(msalConfig);

const Root: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (email: string) => {
    setCurrentUser(email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    // In production, also call msalInstance.logoutRedirect()
  };

  return (
    <MsalProvider instance={msalInstance}>
      <ToastContainer />
      {currentUser ? (
        <App currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </MsalProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
