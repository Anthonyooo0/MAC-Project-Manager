import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest, ALLOWED_DOMAIN } from '../authConfig';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [error, setError] = useState('');

  useEffect(() => {
    if (inProgress === 'none' && accounts.length > 0) {
      const email = accounts[0].username?.toLowerCase() || '';
      if (email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        onLogin(email);
      } else {
        setError(`Access denied. Only @${ALLOWED_DOMAIN} accounts are allowed.`);
        instance.logoutRedirect();
      }
    }
  }, [accounts, inProgress, instance, onLogin]);

  const handleMicrosoftLogin = () => {
    setError('');
    instance.loginRedirect(loginRequest);
  };

  const isLoading = inProgress !== 'none';

  return (
    <div className="min-h-screen flex items-center justify-center bg-mac-light px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <img src="/mac_logo.png" alt="MAC Products" className="h-12 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-800">Project Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in with your MAC Products account</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>
          )}

          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className="w-full bg-[#2F2F2F] hover:bg-[#1F1F1F] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>

          {/* DEV MODE: Skip auth for local development */}
          <button
            onClick={() => onLogin('anthony.jimenez@macproducts.net')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2 px-4 rounded-xl transition-all text-sm"
          >
            Dev Mode: Skip Auth
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">MAC PRODUCTS INTERNAL TOOL</p>
        </div>
      </div>
    </div>
  );
};
