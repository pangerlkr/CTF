import { useState } from 'react';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff, Folder, FileText, Settings, Power, Wifi, Volume2 } from 'lucide-react';

export const SqlInjection = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [openWindow, setOpenWindow] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const sqlInjectionPatterns = [
      "' OR '1'='1",
      "' OR 1=1--",
      "' OR 1=1#",
      "'OR'1'='1",
      "'OR 1=1--",
      "'OR 1=1#",
      "admin'--",
      "admin'#",
      "' OR 'a'='a",
      "') OR ('1'='1",
    ];

    const isInjection = sqlInjectionPatterns.some(pattern =>
      username.toLowerCase().includes(pattern.toLowerCase()) ||
      password.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isInjection) {
      setMessage({
        type: 'success',
        text: `SQL Injection successful! You bypassed authentication. Logging in...`
      });
      setTimeout(() => {
        setLoggedIn(true);
      }, 1500);
    } else if (username === 'admin' && password === 'Admin@123!Secure') {
      setMessage({
        type: 'success',
        text: `Logged in successfully with correct credentials!`
      });
      setTimeout(() => {
        setLoggedIn(true);
      }, 1500);
    } else {
      setMessage({
        type: 'error',
        text: `Invalid credentials. SQL Query: SELECT * FROM users WHERE username=${username} AND password=${password}`
      });
    }
  };

  if (loggedIn) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden" style={{ height: '600px' }}>
        {/* Windows Desktop */}
        <div className="relative h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col">
          {/* Desktop Area */}
          <div className="flex-1 p-6 grid grid-cols-4 gap-4 content-start">
            {/* Desktop Icons */}
            <button
              onClick={() => setOpenWindow('documents')}
              className="flex flex-col items-center gap-2 p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Folder className="w-12 h-12 text-yellow-300" />
              <span className="text-white text-xs font-medium drop-shadow-lg">My Documents</span>
            </button>

            <button
              onClick={() => setOpenWindow('flag')}
              className="flex flex-col items-center gap-2 p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FileText className="w-12 h-12 text-white" />
              <span className="text-white text-xs font-medium drop-shadow-lg">flag.txt</span>
            </button>

            <button
              onClick={() => setOpenWindow('settings')}
              className="flex flex-col items-center gap-2 p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-12 h-12 text-gray-300" />
              <span className="text-white text-xs font-medium drop-shadow-lg">Settings</span>
            </button>
          </div>

          {/* Windows */}
          {openWindow === 'flag' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Title Bar */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">flag.txt - Notepad</span>
                </div>
                <button
                  onClick={() => setOpenWindow(null)}
                  className="text-white hover:bg-red-500 w-8 h-8 flex items-center justify-center rounded transition-colors"
                >
                  ×
                </button>
              </div>
              {/* Content */}
              <div className="p-6 bg-white">
                <div className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
                  <div className="mb-4">
                    <div className="text-emerald-600 font-bold mb-2">CONGRATULATIONS!</div>
                    <div className="text-gray-700 mb-4">You successfully bypassed the authentication using SQL injection.</div>
                  </div>
                  <div className="border-t border-gray-300 pt-4">
                    <div className="text-blue-600 font-bold mb-2">FLAG:</div>
                    <div className="bg-yellow-100 border border-yellow-400 p-3 rounded font-bold text-lg">
                      NCG&#123;sql_injection_grants_admin_access&#125;
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <div className="mb-1">Exploit Type: SQL Injection</div>
                    <div className="mb-1">Vulnerability: Unsanitized user input</div>
                    <div>Risk Level: CRITICAL</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {openWindow === 'documents' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">My Documents</span>
                </div>
                <button
                  onClick={() => setOpenWindow(null)}
                  className="text-white hover:bg-red-500 w-8 h-8 flex items-center justify-center rounded transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6 bg-white">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-600" />
                    <span className="text-sm text-gray-800">passwords.txt</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-600" />
                    <span className="text-sm text-gray-800">database_backup.sql</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded cursor-pointer">
                    <Folder className="w-8 h-8 text-yellow-500" />
                    <span className="text-sm text-gray-800">confidential</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {openWindow === 'settings' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">System Settings</span>
                </div>
                <button
                  onClick={() => setOpenWindow(null)}
                  className="text-white hover:bg-red-500 w-8 h-8 flex items-center justify-center rounded transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="text-sm font-bold text-gray-800">System Information</div>
                    <div className="text-xs text-gray-600 mt-2">OS: Windows Server 2019</div>
                    <div className="text-xs text-gray-600">User: Administrator</div>
                    <div className="text-xs text-gray-600">Status: COMPROMISED</div>
                  </div>
                  <div className="text-xs text-red-600 font-medium">
                    ⚠ Unauthorized access detected
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Taskbar */}
          <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between border-t border-gray-700">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLoggedIn(false)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                <Power className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Logout</span>
              </button>
              <div className="text-white text-sm font-medium">Admin Desktop</div>
            </div>
            <div className="flex items-center gap-3">
              <Wifi className="w-4 h-4 text-white" />
              <Volume2 className="w-4 h-4 text-white" />
              <span className="text-white text-xs">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">Vulnerable Admin Login Portal</h3>
        <p className="text-slate-400 text-sm">This login form is vulnerable to SQL injection</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm font-mono ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {message.text}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Lock className="w-5 h-5" />
          Login
        </button>
      </form>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs mb-2">
          <strong>Hint:</strong> Try SQL injection payloads like: ' OR 1=1-- or ' OR '1'='1
        </p>
        <p className="text-yellow-400 text-xs">
          Use SQL comments (--) or logical operators (OR) to bypass authentication.
        </p>
      </div>

      <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-xs">
          <strong>Debug Info:</strong> This simulator accepts common SQL injection payloads. The actual admin password is hidden.
        </p>
      </div>
    </div>
  );
};
