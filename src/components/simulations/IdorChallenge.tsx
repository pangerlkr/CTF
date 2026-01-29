import { useState, useEffect } from 'react';
import { User, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

type Account = {
  id: number;
  name: string;
  balance: number;
  isTarget: boolean;
};

const accounts: Account[] = [
  { id: 1001, name: 'John Doe', balance: 5420.50, isTarget: false },
  { id: 1002, name: 'Jane Smith', balance: 12350.75, isTarget: false },
  { id: 1003, name: 'Bob Johnson', balance: 8900.00, isTarget: false },
  { id: 1005, name: 'Alice Williams', balance: 6700.25, isTarget: false },
  { id: 1006, name: 'Michael Chen', balance: 15200.80, isTarget: false },
  { id: 1007, name: 'Sarah Davis', balance: 4500.30, isTarget: false },
  { id: 9999, name: 'Administrator', balance: 99999.99, isTarget: true },
];

export const IdorChallenge = () => {
  const [currentUserId] = useState(1001);
  const [inputValue, setInputValue] = useState('1001');
  const [viewingUserId, setViewingUserId] = useState(1001);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);

  const currentAccount = accounts.find(a => a.id === currentUserId);
  const viewingAccount = accounts.find(a => a.id === viewingUserId);

  useEffect(() => {
    (window as any).__viewAccount = (userId: number) => {
      setViewingUserId(userId);
    };
    return () => {
      delete (window as any).__viewAccount;
    };
  }, []);

  useEffect(() => {
    const enforceSecurityCheck = () => {
      const input = document.querySelector('input[type="number"]') as HTMLInputElement;
      if (input && parseInt(input.value) !== currentUserId) {
        input.value = currentUserId.toString();
        setInputValue(currentUserId.toString());
      }
    };

    const interval = setInterval(enforceSecurityCheck, 100);
    return () => clearInterval(interval);
  }, [currentUserId]);

  const validateSession = (userId: number): boolean => {
    const sessionToken = btoa(`user:${currentUserId}:session`);
    const expectedToken = btoa(`user:${userId}:session`);
    return sessionToken === expectedToken;
  };

  const checkAccess = (userId: number) => {
    const account = accounts.find(a => a.id === userId);

    if (account && account.isTarget && account.id !== currentUserId) {
      setMessage({
        type: 'success',
        text: `IDOR vulnerability exploited! You bypassed authentication checks. Flag: NCG{idor_grants_unauthorized_access}`
      });
    } else if (account && account.id !== currentUserId) {
      setMessage({
        type: 'success',
        text: `You accessed ${account.name}'s account! But this isn't the admin. Keep searching...`
      });
    } else {
      setMessage(null);
    }
  };

  useEffect(() => {
    checkAccess(viewingUserId);
  }, [viewingUserId]);

  const handleViewAccount = () => {
    if (blocked) {
      setMessage({
        type: 'error',
        text: 'Too many failed attempts. Account access temporarily locked.'
      });
      return;
    }

    const parsedId = parseInt(inputValue);

    if (isNaN(parsedId)) {
      setMessage({
        type: 'error',
        text: 'Invalid User ID format.'
      });
      return;
    }

    if (!validateSession(parsedId)) {
      setAttempts(prev => prev + 1);
      if (attempts >= 4) {
        setBlocked(true);
        setMessage({
          type: 'error',
          text: 'Security violation detected. Too many unauthorized access attempts.'
        });
        return;
      }
      setMessage({
        type: 'error',
        text: 'Session validation failed. You can only view your own account.'
      });
      return;
    }

    if (parsedId !== currentUserId) {
      setMessage({
        type: 'error',
        text: 'Access Denied: You can only view your own account details.'
      });
      return;
    }

    const account = accounts.find(a => a.id === parsedId);

    if (!account) {
      setMessage({
        type: 'error',
        text: 'Account not found.'
      });
      return;
    }

    setViewingUserId(parsedId);
    setMessage(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">SecureBank Account Portal v2.0</h3>
            <p className="text-slate-400 text-sm">Secure account viewing with enhanced protection</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium">Logged in as: {currentAccount?.name}</span>
        </div>
        <p className="text-slate-400 text-sm">Your User ID: {currentUserId}</p>
        {blocked && (
          <div className="mt-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
            Account locked due to suspicious activity
          </div>
        )}
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Enter User ID to view account
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="User ID"
              disabled={blocked}
            />
            <button
              onClick={handleViewAccount}
              disabled={blocked}
              className={`px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg transition-all ${
                blocked ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-400 hover:to-blue-500'
              }`}
            >
              View
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Attempts: {attempts}/5</p>
        </div>

        {viewingAccount && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Account Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account Holder:</span>
                <span className="text-white font-medium">{viewingAccount.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">User ID:</span>
                <span className="text-white font-medium">{viewingAccount.id}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Account Balance:
                </span>
                <span className="text-2xl font-bold text-cyan-400">
                  ${viewingAccount.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-yellow-500/10 border border-yellow-500/20'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-emerald-400 text-xs">
            <strong>Security Features:</strong> Client-side validation, session token verification, rate limiting, and automated input sanitization every 100ms.
          </p>
        </div>
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-xs mb-2">
            <strong>Hint:</strong> The application has multiple layers of client-side security. The input field auto-resets, session validation blocks requests, and even rate limiting is enabled.
          </p>
          <p className="text-yellow-400 text-xs mb-2">
            All client-side JavaScript can be manipulated! Open the browser console (F12) and look for exposed functions. Try calling <code className="bg-slate-800 px-1 rounded">__viewAccount(userId)</code> with different user IDs.
          </p>
          <p className="text-yellow-400 text-xs">
            The admin account doesn't follow the sequential pattern. Try: 5000, 7777, 8888, 9999, etc.
          </p>
        </div>
      </div>
    </div>
  );
};
