import { useState } from 'react';
import { Globe, Send, AlertCircle, CheckCircle, Shield, Lock, Server } from 'lucide-react';

interface FetchResult {
  success: boolean;
  url: string;
  status?: number;
  content?: string;
  error?: string;
  timestamp: string;
}

export const SsrfChallenge = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [history, setHistory] = useState<FetchResult[]>([]);

  const internalEndpoints = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'internal-admin',
    'admin.internal',
    '192.168.',
    '10.0.',
    '172.16.',
  ];

  const fetchContent = () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const urlLower = url.toLowerCase();
      const isInternalAccess = internalEndpoints.some(endpoint =>
        urlLower.includes(endpoint)
      );

      let fetchResult: FetchResult;

      if (isInternalAccess) {
        // Check for specific admin endpoints on port 8080
        const hasAdminPath = urlLower.includes('/admin');
        const hasPort8080 = urlLower.includes(':8080');

        if (hasAdminPath && hasPort8080) {
          fetchResult = {
            success: true,
            url: url,
            status: 200,
            content: `<!DOCTYPE html>
<html>
<head>
    <title>Internal Admin Panel</title>
</head>
<body>
    <h1>🔒 Internal Admin Dashboard</h1>
    <div class="admin-panel">
        <h2>System Information</h2>
        <ul>
            <li>Server: internal-admin-01</li>
            <li>Status: Online</li>
            <li>Uptime: 127 days</li>
        </ul>

        <h2>Sensitive Data</h2>
        <div class="secret-section">
            <p><strong>API Master Key:</strong> sk_prod_98f7d6e5c4b3a21</p>
            <p><strong>Database Password:</strong> DbP@ssw0rd!2024</p>
            <p><strong>Flag:</strong> NCG{ssrf_internal_access_exposed}</p>
        </div>

        <h2>Admin Actions</h2>
        <button>Reset All Users</button>
        <button>View Logs</button>
        <button>System Backup</button>
    </div>
</body>
</html>`,
            timestamp: new Date().toLocaleTimeString(),
          };
        } else if (hasPort8080) {
          fetchResult = {
            success: true,
            url: url,
            status: 200,
            content: `<!DOCTYPE html>
<html>
<head>
    <title>Internal Service</title>
</head>
<body>
    <h1>TechCorp Internal Service</h1>
    <p>Service is running</p>
    <p>Available endpoints:</p>
    <ul>
        <li>/health</li>
        <li>/status</li>
        <li>/admin (restricted)</li>
    </ul>
</body>
</html>`,
            timestamp: new Date().toLocaleTimeString(),
          };
        } else {
          fetchResult = {
            success: false,
            url: url,
            status: 404,
            error: 'Resource not found',
            timestamp: new Date().toLocaleTimeString(),
          };
        }
      } else if (urlLower.startsWith('http://') || urlLower.startsWith('https://')) {
        const publicSites = [
          'example.com',
          'google.com',
          'github.com',
          'wikipedia.org',
        ];

        if (publicSites.some(site => urlLower.includes(site))) {
          fetchResult = {
            success: true,
            url: url,
            status: 200,
            content: `<!DOCTYPE html>
<html>
<head>
    <title>Example Website</title>
</head>
<body>
    <h1>Welcome to Example Site</h1>
    <p>This is a public website with normal content.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
</body>
</html>`,
            timestamp: new Date().toLocaleTimeString(),
          };
        } else {
          fetchResult = {
            success: false,
            url: url,
            status: 404,
            error: 'Failed to fetch content: Website not reachable',
            timestamp: new Date().toLocaleTimeString(),
          };
        }
      } else {
        fetchResult = {
          success: false,
          url: url,
          error: 'Invalid URL format. Please use http:// or https://',
          timestamp: new Date().toLocaleTimeString(),
        };
      }

      setResult(fetchResult);
      setHistory(prev => [fetchResult, ...prev].slice(0, 5));
      setLoading(false);
    }, 800);
  };

  const exampleUrls = [
    'https://example.com',
    'https://wikipedia.org',
    'https://github.com',
    'https://api.github.com/users/github',
  ];

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-700">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">External Content Fetcher</h2>
              <p className="text-sm text-slate-300">NEXUSCIPHERGUARD INDIA Internal Tools v2.4.1</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-300 font-medium">Internal Network</span>
          </div>
        </div>

        <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-3">
          <p className="text-xs text-blue-200">
            <strong>Info:</strong> This tool allows employees to fetch and preview external website content.
            Enter a URL below to fetch its HTML content.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <label className="text-sm font-medium text-slate-300 mb-3 block">
              Enter URL to Fetch
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && fetchContent()}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={fetchContent}
                disabled={loading || !url.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
          </div>

          {result && (
            <div className={`border rounded-lg overflow-hidden ${
              result.success
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-red-950/30 border-red-800/50'
            }`}>
              <div className={`p-4 border-b ${
                result.success ? 'bg-slate-800 border-slate-700' : 'bg-red-950/50 border-red-800/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-medium ${
                      result.success ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {result.success ? 'Content Fetched Successfully' : 'Fetch Failed'}
                    </span>
                    {result.status && (
                      <span className={`text-sm px-2 py-0.5 rounded ${
                        result.status === 200
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {result.status}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{result.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-mono break-all">{result.url}</p>
              </div>

              <div className="p-4">
                {result.error ? (
                  <p className="text-red-300 text-sm">{result.error}</p>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-400">Response Content</span>
                      {result.content?.includes('NCG{') && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded">
                          <Lock className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-300">Sensitive Data Exposed</span>
                        </div>
                      )}
                    </div>
                    <pre className="text-xs font-mono bg-slate-950 p-4 rounded border border-slate-700 overflow-x-auto text-slate-300 max-h-96 overflow-y-auto">
                      {result.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">Recent Requests</h3>
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      item.success
                        ? 'bg-slate-800/30 border-slate-700'
                        : 'bg-red-950/20 border-red-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {item.success ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-xs font-mono text-slate-400 truncate">{item.url}</span>
                      </div>
                      <span className="text-xs text-slate-500 ml-2">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-white">Example URLs</h3>
            </div>
            <div className="space-y-2">
              {exampleUrls.map((exampleUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setUrl(exampleUrl)}
                  className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded transition-colors"
                >
                  <p className="text-xs font-mono text-cyan-400 break-all">{exampleUrl}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-medium text-white">Tool Information</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-slate-200">Purpose:</strong> Fetch and preview external web content</p>
              <p><strong className="text-slate-200">Access:</strong> Internal employees only</p>
              <p><strong className="text-slate-200">Network:</strong> Connected to corporate network</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-xs font-medium">Security Note</p>
            </div>
            <p className="text-yellow-300/90 text-xs leading-relaxed">
              This tool validates all external URLs before fetching. Only public websites are accessible.
              Internal network access is restricted for security purposes.
            </p>
          </div>

          <div className="p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg">
            <p className="text-blue-300 text-xs leading-relaxed">
              <span className="font-semibold text-blue-200">Objective:</span> Find a way to access the internal
              admin panel that should not be reachable from this tool. The admin panel contains sensitive information.
            </p>
          </div>

          <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
            <p className="text-red-300 text-xs leading-relaxed">
              <span className="font-semibold text-red-200">Real-world Impact:</span> SSRF can allow attackers to
              access internal services, read sensitive data, or perform actions on behalf of the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
