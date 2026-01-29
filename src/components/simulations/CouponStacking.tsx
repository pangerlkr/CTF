import { useState } from 'react';
import { ShoppingCart, Star, Search, Menu, User, MapPin, ChevronDown, Tag, CreditCard, CheckCircle, AlertCircle, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minPurchase?: number;
}

const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 89.99, rating: 4.5, reviews: 3201, image: '🎧' },
  { id: 2, name: 'Smart Watch', price: 199.99, rating: 4.7, reviews: 5432, image: '⌚' },
  { id: 3, name: 'Laptop Stand', price: 49.99, rating: 4.3, reviews: 987, image: '💻' },
  { id: 4, name: 'USB-C Hub', price: 39.99, rating: 4.6, reviews: 1543, image: '🔌' },
  { id: 5, name: 'Desk Lamp', price: 34.99, rating: 4.4, reviews: 876, image: '💡' },
  { id: 6, name: 'Webcam HD', price: 79.99, rating: 4.5, reviews: 2341, image: '📷' },
];

const availableCoupons: Coupon[] = [
  { id: 'SAVE20', code: 'SAVE20', type: 'percentage', value: 20, description: '20% off your order' },
  { id: 'WELCOME15', code: 'WELCOME15', type: 'percentage', value: 15, description: '15% off for new customers' },
  { id: 'FLASH25', code: 'FLASH25', type: 'percentage', value: 25, description: '25% flash sale discount', minPurchase: 100 },
  { id: 'FIXED10', code: 'FIXED10', type: 'fixed', value: 10, description: '$10 off any order' },
  { id: 'LOYALTY30', code: 'LOYALTY30', type: 'percentage', value: 30, description: '30% loyalty reward', minPurchase: 150 },
];

export const CouponStacking = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'shop' | 'cart' | 'checkout'>('shop');
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let discountAmount = 0;
  let runningTotal = subtotal;

  appliedCoupons.forEach(coupon => {
    if (coupon.type === 'percentage') {
      const percentageDiscount = runningTotal * (coupon.value / 100);
      discountAmount += percentageDiscount;
      runningTotal -= percentageDiscount;
    } else {
      discountAmount += coupon.value;
      runningTotal -= coupon.value;
    }
  });

  const total = Math.max(0, subtotal - discountAmount);

  const applyCoupon = () => {
    const couponCode = couponInput.trim().toUpperCase();

    if (!couponCode) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    if (appliedCoupons.some(c => c.code === couponCode)) {
      setCouponMessage({ type: 'error', text: 'Coupon already applied' });
      return;
    }

    const coupon = availableCoupons.find(c => c.code === couponCode);

    if (!coupon) {
      setCouponMessage({ type: 'error', text: 'Invalid coupon code' });
      return;
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      setCouponMessage({
        type: 'error',
        text: `Minimum purchase of $${coupon.minPurchase} required for this coupon`
      });
      return;
    }

    setAppliedCoupons([...appliedCoupons, coupon]);
    setCouponInput('');
    setCouponMessage({ type: 'success', text: `Coupon ${couponCode} applied successfully!` });

    setTimeout(() => setCouponMessage(null), 3000);
  };

  const removeCoupon = (couponId: string) => {
    setAppliedCoupons(appliedCoupons.filter(c => c.id !== couponId));
  };

  const completeOrder = () => {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Your cart is empty!' });
      return;
    }

    if (total === 0 && subtotal > 0) {
      setMessage({
        type: 'success',
        text: `Order placed for FREE! You've exploited the coupon stacking vulnerability! Flag: NCG{stack_coupons_for_free_items}`
      });
    } else if (total < subtotal * 0.1 && appliedCoupons.length >= 3) {
      setMessage({
        type: 'success',
        text: `Order placed for $${total.toFixed(2)}! You've discovered the coupon stacking exploit! Flag: NCG{stack_coupons_for_free_items}`
      });
    } else {
      setMessage({
        type: 'success',
        text: `Order placed successfully! Total: $${total.toFixed(2)}`
      });
    }

    setOrderComplete(true);
    setTimeout(() => {
      setCart([]);
      setAppliedCoupons([]);
      setOrderComplete(false);
      setView('shop');
    }, 4000);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white min-h-screen rounded-lg overflow-hidden">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">
              <span className="text-white">Deal</span>
              <span className="text-yellow-300">Mart</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-sm hover:bg-blue-700 p-2 rounded cursor-pointer">
              <MapPin className="w-4 h-4" />
              <div>
                <div className="text-xs">Deliver to</div>
                <div className="font-bold">Your Location</div>
              </div>
            </div>

            <div className="flex-1 flex">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-l text-black"
              />
              <button className="bg-yellow-400 px-4 py-2 rounded-r hover:bg-yellow-500">
                <Search className="w-5 h-5 text-gray-900" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1 text-sm hover:bg-blue-700 p-2 rounded cursor-pointer">
              <User className="w-4 h-4" />
              <div>
                <div className="text-xs">Hello, Shopper</div>
                <div className="font-bold flex items-center gap-1">
                  Account <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setView(view === 'cart' ? 'shop' : 'cart')}
              className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="font-bold">Cart</span>
            </button>
          </div>
        </div>

        <div className="bg-blue-700 px-4 py-2 flex items-center gap-4 text-sm">
          <button className="flex items-center gap-1 hover:bg-blue-600 p-1 rounded">
            <Menu className="w-4 h-4" />
            <span>All Categories</span>
          </button>
          <button className="hover:bg-blue-600 p-1 rounded">Today's Deals</button>
          <button className="hover:bg-blue-600 p-1 rounded">Customer Service</button>
          <button className="hover:bg-blue-600 p-1 rounded">Gift Cards</button>
          {appliedCoupons.length > 0 && (
            <div className="ml-auto flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded font-bold">
              <Tag className="w-4 h-4" />
              {appliedCoupons.length} Coupon{appliedCoupons.length !== 1 ? 's' : ''} Active
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'shop' && (
          <div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Available Coupons</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {availableCoupons.map(coupon => (
                  <div key={coupon.id} className="bg-white rounded p-2 text-sm">
                    <div className="font-bold text-blue-600">{coupon.code}</div>
                    <div className="text-gray-700 text-xs">{coupon.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="text-6xl mb-3 text-center">{product.image}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 h-12 overflow-hidden">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setView('shop')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 flex gap-4">
                      <div className="text-5xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-green-600 text-sm mb-2">In Stock</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border-2 border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x-2 border-gray-300">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-blue-600 hover:text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-yellow-600" />
                      Apply Coupon Codes
                    </h3>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 uppercase"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
                      >
                        Apply
                      </button>
                    </div>

                    {couponMessage && (
                      <div className={`p-2 rounded mb-3 text-sm ${
                        couponMessage.type === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {couponMessage.text}
                      </div>
                    )}

                    {appliedCoupons.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-semibold text-sm text-gray-700">Applied Coupons:</div>
                        {appliedCoupons.map(coupon => (
                          <div key={coupon.id} className="flex items-center justify-between bg-white border border-green-300 rounded p-2">
                            <div>
                              <div className="font-bold text-green-700">{coupon.code}</div>
                              <div className="text-xs text-gray-600">{coupon.description}</div>
                            </div>
                            <button
                              onClick={() => removeCoupon(coupon.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sticky top-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({cartCount} items):</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>

                      {appliedCoupons.length > 0 && (
                        <>
                          {appliedCoupons.map((coupon, index) => (
                            <div key={coupon.id} className="flex justify-between text-sm text-green-600">
                              <span>{coupon.code} discount:</span>
                              <span className="font-semibold">
                                {coupon.type === 'percentage'
                                  ? `-${coupon.value}%`
                                  : `-$${coupon.value.toFixed(2)}`
                                }
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm text-green-600 font-bold">
                            <span>Total Discount:</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                        </>
                      )}

                      <div className="border-t-2 border-gray-300 pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-blue-600">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {total === 0 && subtotal > 0 && (
                      <div className="mb-3 p-3 bg-green-100 border border-green-300 rounded text-center">
                        <p className="text-green-800 font-bold text-sm">FREE Order!</p>
                      </div>
                    )}

                    <button
                      onClick={() => setView('checkout')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mb-2"
                    >
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={() => setView('shop')}
                      className="w-full text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'checkout' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h2>

            {message && (
              <div className={`p-4 rounded-lg flex items-start gap-3 mb-6 ${
                message.type === 'success'
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-red-100 border-2 border-red-300'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message.text}
                </p>
              </div>
            )}

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupons.length > 0 && (
                  <>
                    {appliedCoupons.map(coupon => (
                      <div key={coupon.id} className="flex justify-between text-green-600">
                        <span>{coupon.code}:</span>
                        <span className="font-semibold">
                          {coupon.type === 'percentage'
                            ? `-${coupon.value}%`
                            : `-$${coupon.value.toFixed(2)}`
                          }
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Total Savings:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-xl font-bold text-blue-600 pt-2 border-t-2">
                  <span>Final Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setView('cart')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
              >
                Back to Cart
              </button>
              <button
                onClick={completeOrder}
                disabled={orderComplete}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {orderComplete ? 'Processing...' : 'Place Order'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Hint:</strong> Try stacking multiple coupons together. The system might not prevent you from applying percentage discounts that compound with each other.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
