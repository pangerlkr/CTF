import { useState } from 'react';
import { Shield, CheckCircle, User, Mail, Calendar, MapPin } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  joinedDate: string;
  status: string;
}

export const HardcodedApiKeys = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const API_CONFIG = {
    key: 'sk_live_51HxYz2K3L4m5N6o7P8q9R0s',
    endpoint: 'https://api.example.com',
    flag: 'NCG{never_hardcode_secrets_in_frontend}',
    version: 'v1'
  };

  if (typeof window !== 'undefined' && API_CONFIG.flag) {
    window.__APP_CONFIG__ = API_CONFIG;
  }

  const simulateApiCall = async () => {
    setLoading(true);
    setMessage({ type: 'info', text: 'Making API request...' });

    setTimeout(() => {
      const mockUser: UserData = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: 'Pangerkumzuk Longkumer',
        email: 'contact@pangerlkr.link',
        role: 'Senior Developer',
        location: 'Kohima, Nagaland 797001, India',
        joinedDate: '2023-12-23',
        status: 'Active'
      };

      setUserData(mockUser);
      setMessage({
        type: 'success',
        text: 'API request successful! User data loaded from secure endpoint.'
      });
      setLoading(false);
    }, 800);
  };

  const fetchUserData = async (userId: string) => {
    const headers = {
      'Authorization': `Bearer ${API_CONFIG.key}`,
      'X-API-Key': API_CONFIG.key
    };

    return fetch(`${API_CONFIG.endpoint}/users/${userId}`, { headers });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">SecureApp Dashboard v2.0</h3>
      </div>

      <p className="text-slate-400 mb-6 text-sm">
        A simple web application that uses a third-party API to fetch user data.
        All API calls are authenticated using secure tokens.
      </p>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : message.type === 'error'
            ? 'bg-red-500/10 border border-red-500/20'
            : 'bg-blue-500/10 border border-blue-500/20'
        }`}>
          {message.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          <p className={`${
            message.type === 'success' ? 'text-emerald-400' :
            message.type === 'error' ? 'text-red-400' :
            'text-blue-400'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-6 mb-6">
        <h4 className="text-white font-semibold mb-4">User Management</h4>
        <button
          onClick={simulateApiCall}
          disabled={loading}
          className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Load User Data'}
        </button>

        {userData && (
          <div className="mt-6 bg-slate-800/50 border border-slate-600 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="text-white font-semibold text-lg">{userData.name}</h5>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded">
                  {userData.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{userData.role}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{userData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">Joined {userData.joinedDate}</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-xs">User ID:</span>
                <span className="text-slate-300 text-xs font-mono">{userData.id}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-400 text-sm font-medium mb-2">Hint:</p>
        <p className="text-yellow-300/80 text-sm">
          Client-side code is visible to anyone. Open your browser's Developer Tools (F12) and inspect the JavaScript source.
          Look for any hardcoded credentials, API keys, or tokens embedded in the code.
        </p>
      </div>

      <div className="mt-6 bg-slate-950/50 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-500 text-xs mb-2">Security Note:</p>
        <p className="text-slate-500 text-xs">
          All sensitive credentials should be stored securely on the server-side, never in client-side code.
          The flag format is: NCG&#123;...&#125;
        </p>
      </div>
    </div>
  );
};
