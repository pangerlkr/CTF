import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

export const PriceManipulation = () => {
  const [quantity, setQuantity] = useState(1);
  const [price] = useState(8299);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set the initial value only once and never touch it again
    if (priceInputRef.current) {
      priceInputRef.current.value = price.toString();
    }
  }, []);

  const handlePurchase = () => {
    const hiddenPriceInput = document.getElementById('hidden-price') as HTMLInputElement;
    const actualPrice = parseFloat(hiddenPriceInput?.value || '8299');
    const totalPrice = actualPrice * quantity;

    if (actualPrice < price && totalPrice < 833 && quantity > 0) {
      setMessage({
        type: 'success',
        text: `Congratulations! You manipulated the price from ₹${price.toLocaleString('en-IN')} to ₹${actualPrice.toLocaleString('en-IN')}. Flag: NCG{client_side_validation_is_not_enough}`
      });
    } else if (totalPrice < price * quantity) {
      setMessage({
        type: 'error',
        text: `Good try! You modified the price to ₹${actualPrice.toLocaleString('en-IN')}, but the total is still ₹${totalPrice.toLocaleString('en-IN')}. Try to get the total below ₹833!`
      });
    } else {
      setMessage({
        type: 'error',
        text: `Purchase processed for ₹${totalPrice.toLocaleString('en-IN')}. Hint: Use browser DevTools to inspect and modify the hidden price field!`
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">SecureShop E-Commerce Simulator</h3>
        <p className="text-slate-400 text-sm">Try to purchase the premium item below for less than ₹833</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-2">Premium Cyber Tool</h4>
            <p className="text-slate-400 text-sm mb-4">Professional penetration testing toolkit</p>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-20 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Price per item</label>
                <div className="text-2xl font-bold text-cyan-400">₹{price.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <input
              ref={priceInputRef}
              type="hidden"
              id="hidden-price"
              name="price"
              data-price={price}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <span className="text-white font-medium">Total:</span>
          <span className="text-2xl font-bold text-cyan-400" id="total-display">
            ₹{(price * quantity).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
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
        onClick={handlePurchase}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
      >
        Complete Purchase
      </button>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs mb-3">
          <strong>Hint:</strong> The price is stored in a hidden form field. Manipulate it to pay less than $10!
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-yellow-400 text-xs font-semibold mb-1">Method 1: Browser Console (Easiest)</p>
            <code className="text-xs text-cyan-300 bg-slate-900 px-2 py-1 rounded block">
              document.getElementById('hidden-price').value = '1'
            </code>
            <p className="text-yellow-400 text-xs mt-1">Press F12 → Console tab → Paste the code above → Press Enter → Click Complete Purchase</p>
          </div>
          <div>
            <p className="text-yellow-400 text-xs font-semibold mb-1">Method 2: Edit HTML</p>
            <p className="text-yellow-400 text-xs">
              Press F12 → Elements/Inspector tab → Find &lt;input id="hidden-price"&gt; → Edit its value attribute
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
