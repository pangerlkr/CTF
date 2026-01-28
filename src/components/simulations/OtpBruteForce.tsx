import { useState } from 'react';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

export const OtpBruteForce = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const correctOtp = '231500';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setAttempts(attempts + 1);

    if (otp === correctOtp) {
      setMessage({
        type: 'success',
        text: `OTP verified successfully after ${attempts + 1} attempts! This system has no rate limiting. Flag: NCG{rate_limiting_prevents_brute_force}`
      });
    } else {
      setMessage({
        type: 'error',
        text: `Invalid OTP. Attempt #${attempts + 1}. No rate limiting detected - you can try again immediately!`
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">OTP Verification System</h3>
        <p className="text-slate-400 text-sm">Enter the 6-digit OTP sent to your device</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium">Security Status</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Rate Limiting:</span>
            <span className="text-red-400 font-medium">DISABLED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Max Attempts:</span>
            <span className="text-red-400 font-medium">UNLIMITED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Attempts:</span>
            <span className="text-cyan-400 font-bold">{attempts}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Enter 6-digit OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-cyan-500"
            placeholder="••••••"
            required
          />
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
            <p className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {message.text}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={otp.length !== 6}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify OTP
        </button>
      </form>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs mb-2">
          <strong>Hint:</strong> This system has no rate limiting on OTP verification attempts.
        </p>
        <p className="text-yellow-400 text-xs mb-2">
          A 6-digit OTP has only 1,000,000 possible combinations (000000-999999).
        </p>
        <p className="text-yellow-400 text-xs">
          You could write a script to brute force all combinations, or try common patterns like 123456, 000000, etc.
        </p>
      </div>

      <div className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-xs">
          <strong>In real scenarios:</strong> Systems should implement rate limiting, account lockouts,
          CAPTCHA challenges, and exponential backoff to prevent brute force attacks.
        </p>
      </div>
    </div>
  );
};
