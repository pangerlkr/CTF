import { useState } from 'react';
import { Key, AlertCircle, CheckCircle, Copy } from 'lucide-react';

export const JwtChallenge = () => {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMDEsInVzZXJuYW1lIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciIsImlhdCI6MTYzMDAwMDAwMH0.dGVzdF9zaWduYXR1cmVfaGVyZQ');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [apiResponse, setApiResponse] = useState<string>('');

  const decodeJwt = (jwt: string) => {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) return null;

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      return { header, payload, signature: parts[2] };
    } catch {
      return null;
    }
  };

  const handleVerify = () => {
    setMessage(null);
    setApiResponse('');

    const decoded = decodeJwt(token);

    if (!decoded) {
      setMessage({
        type: 'error',
        text: 'Invalid JWT format. A JWT has three parts separated by dots: header.payload.signature'
      });
      return;
    }

    const { header, payload } = decoded;

    if (header.alg?.toLowerCase() === 'none' && payload.role === 'admin') {
      setMessage({
        type: 'success',
        text: `JWT manipulation successful! You forged an admin token using the 'none' algorithm. Flag: NCG{jwt_alg_none_is_dangerous}`
      });
      setApiResponse(JSON.stringify({
        success: true,
        message: 'Admin access granted',
        user: payload
      }, null, 2));
    } else if (payload.role === 'admin' && header.alg?.toLowerCase() !== 'none') {
      setMessage({
        type: 'error',
        text: 'Token signature verification failed. You modified the payload but the signature is invalid.'
      });
      setApiResponse(JSON.stringify({
        success: false,
        error: 'Invalid signature'
      }, null, 2));
    } else {
      setMessage({
        type: 'info',
        text: `Token verified. User: ${payload.username}, Role: ${payload.role}`
      });
      setApiResponse(JSON.stringify({
        success: true,
        message: 'User access granted',
        user: payload
      }, null, 2));
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
  };

  const decoded = decodeJwt(token);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">JWT Authentication API</h3>
        <p className="text-slate-400 text-sm">Manipulate the JWT token to gain admin access</p>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">JWT Token</label>
            <button
              onClick={copyToken}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500 resize-none break-all"
          />
        </div>

        {decoded && (
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h5 className="text-sm font-bold text-white mb-2">Header</h5>
              <pre className="text-xs text-cyan-400 font-mono overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h5 className="text-sm font-bold text-white mb-2">Payload</h5>
              <pre className="text-xs text-cyan-400 font-mono overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <button
          onClick={handleVerify}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Key className="w-5 h-5" />
          Verify Token & Access API
        </button>

        {message && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : message.type === 'error'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-blue-500/10 border border-blue-500/20'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className={`w-5 h-5 ${message.type === 'error' ? 'text-red-400' : 'text-blue-400'} flex-shrink-0 mt-0.5`} />
            )}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-emerald-400' :
              message.type === 'error' ? 'text-red-400' : 'text-blue-400'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {apiResponse && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h5 className="text-sm font-bold text-white mb-2">API Response</h5>
            <pre className="text-xs text-slate-300 font-mono overflow-x-auto">
              {apiResponse}
            </pre>
          </div>
        )}
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs mb-2">
          <strong>Hint:</strong> JWT tokens are base64-encoded and have three parts: header.payload.signature
        </p>
        <p className="text-yellow-400 text-xs mb-2">
          Decode the token, change the role to "admin", and set the algorithm to "none" in the header.
        </p>
        <p className="text-yellow-400 text-xs">
          When using "none" algorithm, you can remove or keep the signature part (it won't be verified).
        </p>
      </div>

      <div className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-xs">
          <strong>Tool:</strong> Use online JWT decoders or the browser console with atob() to decode base64.
          Remember to encode back with btoa() after modifications.
        </p>
      </div>
    </div>
  );
};
