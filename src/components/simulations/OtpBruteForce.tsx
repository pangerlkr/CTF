import { useState } from 'react';
import { MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

export const OtpBruteForce = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const correctOtp = '231500';

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('otp');
      setMessage(null);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setAttempts(attempts + 1);

    if (otp === correctOtp) {
      setMessage({
        type: 'success',
        text: `Verified! Flag: NCG{rate_limiting_prevents_brute_force}`
      });
    } else {
      setMessage({
        type: 'error',
        text: `Wrong code. Try again (Attempt #${attempts + 1})`
      });
    }
  };

  const handleEditNumber = () => {
    setStep('phone');
    setOtp('');
    setMessage(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
      {step === 'phone' ? (
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-light text-gray-800 mb-2">WhatsApp</h2>
          </div>

          <div className="mb-8 text-center">
            <p className="text-gray-600 text-sm leading-relaxed mb-1">
              Verify your phone number
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              WhatsApp will send an SMS message to verify your phone number.
            </p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <div className="flex gap-3">
                <select className="px-4 py-3 border-b-2 border-gray-200 focus:border-[#25D366] outline-none text-gray-700 bg-white">
                  <option>United States</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <input
                  type="text"
                  value="+1"
                  disabled
                  className="w-16 px-4 py-3 border-b-2 border-gray-200 text-gray-700 bg-gray-50 text-center"
                />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Phone number"
                  className="flex-1 px-4 py-3 border-b-2 border-gray-200 focus:border-[#25D366] outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={phoneNumber.length < 10}
              className="w-full py-3 bg-[#25D366] text-white font-medium rounded-full hover:bg-[#20BD5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          </form>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-xs mb-2">
              <strong>Challenge Hint:</strong> No rate limiting on OTP attempts
            </p>
            <p className="text-yellow-700 text-xs">
              6-digit OTPs have only 1,000,000 combinations. Try common patterns or brute force!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-light text-gray-800 mb-2">Verify +1 {phoneNumber}</h2>
            <button
              onClick={handleEditNumber}
              className="text-[#25D366] text-sm hover:underline"
            >
              Edit number
            </button>
          </div>

          <div className="mb-6 text-center">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Enter the 6-digit code we sent to your phone
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
              <span>Rate Limiting:</span>
              <span className="text-red-500 font-semibold">DISABLED</span>
              <span className="mx-2">•</span>
              <span>Attempts: {attempts}</span>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-4 border-b-2 border-gray-200 focus:border-[#25D366] outline-none text-gray-700 text-center text-2xl tracking-[0.5em] font-light"
                placeholder="- - - - - -"
                autoFocus
                required
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {message.text}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full py-3 bg-[#25D366] text-white font-medium rounded-full hover:bg-[#20BD5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              VERIFY
            </button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-[#25D366] text-sm hover:underline">
              Didn't receive code?
            </button>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-xs text-center">
              <strong>Security Note:</strong> Real systems use rate limiting to prevent brute force attacks
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
