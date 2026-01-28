import { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export const PaymentBypass = () => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [amount, setAmount] = useState('99.99');

  const handlePayment = () => {
    const parsedAmount = parseFloat(amount || '99.99');

    setMessage(null);

    if (parsedAmount < 0.01) {
      setMessage({
        type: 'success',
        text: `Payment verification bypassed! You processed a payment for $${parsedAmount.toFixed(2)}. Flag: NCG{payment_logic_bypassed_successfully}`
      });
      setPaymentStatus('verified');
    } else if (parsedAmount < 50) {
      setMessage({
        type: 'error',
        text: `Payment processed for $${parsedAmount.toFixed(2)}. Try to bypass payment logic to pay even less!`
      });
      setPaymentStatus('completed');
    } else {
      setMessage({
        type: 'error',
        text: `Standard payment of $${parsedAmount.toFixed(2)} processed successfully.`
      });
      setPaymentStatus('completed');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">Payment Gateway Simulator</h3>
        <p className="text-slate-400 text-sm">Process a premium subscription payment</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-4">
        <h4 className="text-lg font-bold text-white mb-3">Premium Subscription</h4>
        <p className="text-slate-400 text-sm mb-4">Annual access to all premium features</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-cyan-400">$99.99</span>
          <span className="text-slate-500">/year</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Payment Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold">$</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <input type="hidden" name="verified" value={paymentStatus} />
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
          onClick={handlePayment}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <CreditCard className="w-5 h-5" />
          Process Payment
        </button>
      </div>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs mb-2">
          <strong>Hint:</strong> The payment verification logic might not properly validate the amount.
        </p>
        <p className="text-yellow-400 text-xs">
          Try modifying the payment amount to something unexpected. What happens with very small or negative values?
        </p>
      </div>
    </div>
  );
};
