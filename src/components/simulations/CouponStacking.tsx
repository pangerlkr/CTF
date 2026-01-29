import { useState } from 'react';
import { ShoppingCart, Tag, Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

const AVAILABLE_PRODUCTS = [
  { id: 1, name: 'Premium Laptop', price: 1200 },
  { id: 2, name: 'Wireless Mouse', price: 50 },
  { id: 3, name: 'Mechanical Keyboard', price: 150 },
  { id: 4, name: 'USB-C Hub', price: 80 },
];

const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'SAVE20', discount: 20, type: 'percentage' },
  { code: 'FIRST50', discount: 50, type: 'fixed' },
];

export const CouponStacking = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
  const [couponInput, setCouponInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addToCart = (product: typeof AVAILABLE_PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const applyCoupon = () => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code === couponInput.toUpperCase());

    if (!coupon) {
      setMessage({ type: 'error', text: 'Invalid coupon code' });
      return;
    }

    if (appliedCoupons.find(c => c.code === coupon.code)) {
      setMessage({ type: 'error', text: 'Coupon already applied' });
      return;
    }

    setAppliedCoupons(prev => [...prev, coupon]);
    setMessage({ type: 'success', text: `Coupon ${coupon.code} applied!` });
    setCouponInput('');
  };

  const removeCoupon = (code: string) => {
    setAppliedCoupons(prev => prev.filter(c => c.code !== code));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let total = subtotal;
    appliedCoupons.forEach(coupon => {
      if (coupon.type === 'percentage') {
        total = total * (1 - coupon.discount / 100);
      } else {
        total = total - coupon.discount;
      }
    });

    return {
      subtotal,
      total: Math.max(0, total),
      savings: subtotal - Math.max(0, total)
    };
  };

  const { subtotal, total, savings } = calculateTotal();

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-cyan-500/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          TechStore - Shopping Cart
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-white font-semibold mb-3">Available Products</h4>
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_PRODUCTS.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors text-left"
              >
                <div className="text-white font-medium text-sm">{product.name}</div>
                <div className="text-cyan-400 font-bold">${product.price}</div>
              </button>
            ))}
          </div>
        </div>

        {cart.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3">Your Cart</h4>
            <div className="space-y-2">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{item.name}</div>
                    <div className="text-slate-400 text-xs">${item.price} each</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-cyan-400 font-bold w-20 text-right">
                      ${item.price * item.quantity}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Apply Coupon Code
          </h4>
          {message && (
            <div className={`mb-3 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
            />
            <button
              onClick={applyCoupon}
              disabled={!couponInput.trim()}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Apply
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Try: WELCOME10, SAVE20, FIRST50
          </div>
        </div>

        {appliedCoupons.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3">Applied Coupons</h4>
            <div className="space-y-2">
              {appliedCoupons.map(coupon => (
                <div
                  key={coupon.code}
                  className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium text-sm">{coupon.code}</span>
                    <span className="text-slate-400 text-sm">
                      ({coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`} off)
                    </span>
                  </div>
                  <button
                    onClick={() => removeCoupon(coupon.code)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div className="border-t border-slate-700 pt-4 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Savings:</span>
                <span>-${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-slate-700">
              <span>Total:</span>
              <span className={total === 0 ? 'text-emerald-400' : ''}>${total.toFixed(2)}</span>
            </div>
            {total === 0 && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-emerald-400 text-sm text-center font-medium">
                  You got everything for FREE! The flag might be nearby...
                </p>
                <p className="text-emerald-400 text-xs text-center mt-2 font-mono">
                  NCG{`{stack_coupons_for_free_items}`}
                </p>
              </div>
            )}
            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all mt-4">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
