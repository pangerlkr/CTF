import { useState } from 'react';
import { ShoppingCart, Star, Search, Menu, User, MapPin, ChevronDown, Package, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  prime: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Wireless Bluetooth Headphones', price: 79.99, rating: 4.5, reviews: 12453, image: '🎧', prime: true },
  { id: 2, name: 'Smart Watch Fitness Tracker', price: 129.99, rating: 4.3, reviews: 8721, image: '⌚', prime: true },
  { id: 3, name: 'Portable Phone Charger 20000mAh', price: 34.99, rating: 4.7, reviews: 15632, image: '🔋', prime: true },
  { id: 4, name: 'Mechanical Gaming Keyboard RGB', price: 89.99, rating: 4.6, reviews: 9284, image: '⌨️', prime: true },
  { id: 5, name: 'Wireless Mouse Ergonomic Design', price: 29.99, rating: 4.4, reviews: 6543, image: '🖱️', prime: false },
  { id: 6, name: '4K Webcam with Microphone', price: 119.99, rating: 4.5, reviews: 4321, image: '📹', prime: true },
];

export const UnlimitedCashback = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'shop' | 'cart' | 'checkout'>('shop');
  const [cashbackPoints, setCashbackPoints] = useState(0);
  const [cashbackApplied, setCashbackApplied] = useState(false);
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
  const tax = subtotal * 0.08;
  const discount = cashbackApplied ? (cashbackPoints / 100) : 0;
  const total = Math.max(0, subtotal + tax - discount);

  const applyCashback = () => {
    if (!cashbackApplied) {
      setCashbackApplied(true);
      const earnedPoints = Math.floor(subtotal * 10);
      setCashbackPoints(cashbackPoints + earnedPoints);
      setMessage({
        type: 'success',
        text: `Cashback applied! You earned ${earnedPoints} points. Current balance: ${cashbackPoints + earnedPoints} points.`
      });
    } else {
      setCashbackApplied(false);
      setMessage(null);
    }
  };

  const completeOrder = () => {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Your cart is empty!' });
      return;
    }

    if (cashbackPoints >= 10000) {
      setMessage({
        type: 'success',
        text: `Order placed! You've discovered the unlimited cashback exploit! Flag: NCG{cashback_race_condition_exploit}`
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
      setCashbackApplied(false);
      setOrderComplete(false);
      setView('shop');
    }, 3000);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-[#131921] text-white">
        <div className="px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">
              <span className="text-white">shop</span>
              <span className="text-[#FF9900]">.now</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-sm hover:border border-white p-1 cursor-pointer">
              <MapPin className="w-4 h-4" />
              <div>
                <div className="text-xs text-gray-300">Deliver to</div>
                <div className="font-bold">New York 10001</div>
              </div>
            </div>

            <div className="flex-1 flex">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-l text-black"
              />
              <button className="bg-[#FF9900] px-4 py-2 rounded-r hover:bg-[#f7931e]">
                <Search className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1 text-sm hover:border border-white p-1 cursor-pointer">
              <User className="w-4 h-4" />
              <div>
                <div className="text-xs">Hello, User</div>
                <div className="font-bold flex items-center gap-1">
                  Account <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setView(view === 'cart' ? 'shop' : 'cart')}
              className="flex items-center gap-2 hover:border border-white p-2 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF9900] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="font-bold">Cart</span>
            </button>
          </div>
        </div>

        <div className="bg-[#232F3E] px-4 py-2 flex items-center gap-4 text-sm">
          <button className="flex items-center gap-1 hover:border border-white p-1">
            <Menu className="w-4 h-4" />
            <span>All</span>
          </button>
          <button className="hover:border border-white p-1">Today's Deals</button>
          <button className="hover:border border-white p-1">Customer Service</button>
          <button className="hover:border border-white p-1">Registry</button>
          <button className="hover:border border-white p-1">Gift Cards</button>
          <button className="hover:border border-white p-1">Sell</button>
          <div className="ml-auto flex items-center gap-2 bg-[#FF9900] text-black px-3 py-1 rounded font-bold">
            <Package className="w-4 h-4" />
            Cashback: {cashbackPoints} pts
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'shop' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="text-6xl mb-3 text-center">{product.image}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 h-12 overflow-hidden">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#FF9900] text-[#FF9900]' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-blue-600">{product.reviews.toLocaleString()}</span>
                  </div>
                  {product.prime && (
                    <div className="text-xs text-[#00A8E1] font-bold mb-2">
                      prime Free Shipping
                    </div>
                  )}
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xs align-top">$</span>
                    <span className="text-2xl font-semibold">{Math.floor(product.price)}</span>
                    <span className="text-xs">{(product.price % 1).toFixed(2).substring(1)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold py-2 rounded-full transition-colors"
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
              <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setView('shop')}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold px-6 py-2 rounded-full"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white border border-gray-300 rounded-lg p-4 flex gap-4">
                      <div className="text-5xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-green-700 text-sm mb-2">In Stock</p>
                        {item.prime && (
                          <p className="text-xs text-[#00A8E1] font-bold mb-2">prime Eligible</p>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
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
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-300 rounded-lg p-4 sticky top-4">
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-700 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Your order qualifies for FREE Delivery
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({cartCount} items):</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                      </div>
                      {cashbackApplied && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Cashback Discount:</span>
                          <span className="font-semibold">-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-red-700">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={applyCashback}
                      className={`w-full mb-3 py-2 rounded-full font-semibold transition-colors ${
                        cashbackApplied
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-[#FF9900] hover:bg-[#f7931e] text-white'
                      }`}
                    >
                      {cashbackApplied ? 'Cashback Applied' : 'Apply Cashback (10% back)'}
                    </button>

                    <button
                      onClick={() => setView('checkout')}
                      className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold py-3 rounded-full transition-colors mb-2"
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
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
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

            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                {cashbackApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Cashback Discount:</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-red-700 pt-2 border-t">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF9900]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF9900]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF9900]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setView('cart')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-full transition-colors"
              >
                Back to Cart
              </button>
              <button
                onClick={completeOrder}
                disabled={orderComplete}
                className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {orderComplete ? 'Processing...' : 'Place Order'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Try applying cashback multiple times before checkout. Notice anything unusual with the points balance?
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
