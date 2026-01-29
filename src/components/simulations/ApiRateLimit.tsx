import { useState, useEffect } from 'react';
import { Send, Clock, AlertCircle, CheckCircle, Settings, Activity, Zap } from 'lucide-react';

interface RequestLog {
  id: number;
  timestamp: string;
  status: number;
  message: string;
  response?: string;
}

interface HeaderConfig {
  key: string;
  value: string;
}

export const ApiRateLimit = () => {
  const [requestCount, setRequestCount] = useState(0);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [customHeaders, setCustomHeaders] = useState<HeaderConfig[]>([]);
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const MAX_REQUESTS = 5;
  const RESET_TIME = 60;

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && requestCount > 0) {
      setRequestCount(0);
    }
  }, [timeRemaining, requestCount]);

  const checkBypassHeaders = (headers: HeaderConfig[]): boolean => {
    const bypassHeaders = [
      { key: 'X-Forwarded-For', value: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ },
      { key: 'X-Real-IP', value: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ },
      { key: 'X-Originating-IP', value: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ },
      { key: 'X-Client-IP', value: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ },
    ];

    return headers.some(header =>
      bypassHeaders.some(bypass =>
        header.key.toLowerCase() === bypass.key.toLowerCase() &&
        bypass.value.test(header.value)
      )
    );
  };

  const makeRequest = () => {
    setLoading(true);

    setTimeout(() => {
      const hasBypass = checkBypassHeaders(customHeaders);

      if (requestCount >= MAX_REQUESTS && !hasBypass) {
        const newLog: RequestLog = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          status: 429,
          message: 'Too Many Requests',
          response: 'Rate limit exceeded. Please try again later.',
        };
        setLogs(prev => [newLog, ...prev]);
        setTimeRemaining(RESET_TIME);
        setLoading(false);
        return;
      }

      if (!hasBypass) {
        setRequestCount(prev => prev + 1);
        if (requestCount + 1 === MAX_REQUESTS) {
          setTimeRemaining(RESET_TIME);
        }
      }

      const newLog: RequestLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        status: 200,
        message: 'OK',
        response: hasBypass
          ? JSON.stringify({
              success: true,
              data: 'Premium account data',
              flag: 'NCG{rate_limit_bypass_via_headers}',
              message: 'Successfully bypassed rate limiting!'
            }, null, 2)
          : JSON.stringify({
              success: true,
              data: 'Public data',
              remaining: MAX_REQUESTS - requestCount - 1
            }, null, 2),
      };
      setLogs(prev => [newLog, ...prev]);
      setLoading(false);
    }, 400);
  };

  const addHeader = () => {
    if (newHeaderKey.trim() && newHeaderValue.trim()) {
      setCustomHeaders(prev => [...prev, { key: newHeaderKey, value: newHeaderValue }]);
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (index: number) => {
    setCustomHeaders(prev => prev.filter((_, i) => i !== index));
  };

  const resetRateLimit = () => {
    setRequestCount(0);
    setTimeRemaining(0);
    setLogs([]);
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-700">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">API Rate Limiter Test</h2>
              <p className="text-sm text-slate-400">https://api.example.com/premium/data</p>
            </div>
          </div>
          <button
            onClick={resetRateLimit}
            className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-slate-400">Requests Made</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {requestCount} / {MAX_REQUESTS}
            </div>
            <div className="mt-2 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  requestCount >= MAX_REQUESTS ? 'bg-red-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${(requestCount / MAX_REQUESTS) * 100}%` }}
              />
            </div>
          </div>

          {timeRemaining > 0 && (
            <div className="bg-red-950/30 rounded-lg p-4 border border-red-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium text-red-300">Rate Limited</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {timeRemaining}s
              </div>
              <div className="text-xs text-red-300 mt-1">
                Wait to make more requests
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 p-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Custom Headers
              </h3>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 border border-slate-700 mb-3">
              <div className="space-y-3">
                {customHeaders.map((header, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-800 rounded border border-slate-700">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="text-sm font-mono text-cyan-400">{header.key}</div>
                      <div className="text-sm font-mono text-slate-300">{header.value}</div>
                    </div>
                    <button
                      onClick={() => removeHeader(index)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newHeaderKey}
                    onChange={(e) => setNewHeaderKey(e.target.value)}
                    placeholder="Header name"
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                    onKeyPress={(e) => e.key === 'Enter' && addHeader()}
                  />
                  <input
                    type="text"
                    value={newHeaderValue}
                    onChange={(e) => setNewHeaderValue(e.target.value)}
                    placeholder="Header value"
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                    onKeyPress={(e) => e.key === 'Enter' && addHeader()}
                  />
                </div>
                <button
                  onClick={addHeader}
                  disabled={!newHeaderKey.trim() || !newHeaderValue.trim()}
                  className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Header
                </button>
              </div>
            </div>

            <button
              onClick={makeRequest}
              disabled={loading || (requestCount >= MAX_REQUESTS && timeRemaining > 0 && !checkBypassHeaders(customHeaders))}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending Request...' : 'Send API Request'}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Request History</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No requests yet. Try sending an API request!
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border ${
                      log.status === 200
                        ? 'bg-emerald-950/30 border-emerald-800/50'
                        : 'bg-red-950/30 border-red-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {log.status === 200 ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          log.status === 200 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {log.status} {log.message}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{log.timestamp}</span>
                    </div>
                    {log.response && (
                      <pre className={`text-xs font-mono mt-2 p-2 rounded overflow-x-auto ${
                        log.status === 200
                          ? 'bg-emerald-950/50 text-emerald-300'
                          : 'bg-red-950/50 text-red-300'
                      }`}>
                        {log.response}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-3">Challenge Info</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="font-semibold text-slate-200">Endpoint:</span>
                <p className="font-mono text-cyan-400 mt-1">/premium/data</p>
              </div>
              <div>
                <span className="font-semibold text-slate-200">Rate Limit:</span>
                <p className="mt-1">{MAX_REQUESTS} requests per minute</p>
              </div>
              <div>
                <span className="font-semibold text-slate-200">Method:</span>
                <p className="font-mono text-cyan-400 mt-1">GET</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-950/30 border border-yellow-800/50 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-xs font-medium">Challenge Hint</p>
            </div>
            <p className="text-yellow-300/90 text-xs leading-relaxed mb-2">
              Rate limiting is often based on IP addresses. Try exploring HTTP headers that can influence how the server identifies your client.
            </p>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-yellow-400 hover:text-yellow-300 underline"
            >
              {showHint ? 'Hide' : 'Show'} Additional Hint
            </button>
            {showHint && (
              <p className="text-yellow-300/90 text-xs leading-relaxed mt-2 pt-2 border-t border-yellow-800/50">
                Look for headers like X-Forwarded-For, X-Real-IP, or similar proxy headers. These headers can be used to spoof your IP address and bypass rate limiting.
              </p>
            )}
          </div>

          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-slate-300 text-xs leading-relaxed">
              <span className="font-semibold text-white">Objective:</span> Make requests beyond the rate limit to retrieve premium data containing the flag.
            </p>
          </div>

          <div className="p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg">
            <p className="text-blue-300 text-xs leading-relaxed">
              <span className="font-semibold text-blue-200">Real-world Impact:</span> Poorly implemented rate limiting can allow attackers to abuse APIs, scrape data, or perform brute force attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
