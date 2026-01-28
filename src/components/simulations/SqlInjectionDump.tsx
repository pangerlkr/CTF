import { useState } from 'react';
import { Search, ShoppingCart, MapPin, User, Menu, Star, ChevronDown, Package, AlertCircle, X, Plus, Minus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  prime: boolean;
  category: string;
  inStock: boolean;
  description: string;
}

interface SecretData {
  id: number;
  type: string;
  data: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Wireless Bluetooth Headphones - Noise Cancelling', price: 3999, originalPrice: 6499, rating: 4.5, reviews: 12847, image: '🎧', prime: true, category: 'Electronics', inStock: true, description: 'Premium noise cancelling headphones with 30-hour battery life' },
  { id: 2, name: 'Smart Watch Series 7 - Fitness Tracker', price: 32999, rating: 4.8, reviews: 8934, image: '⌚', prime: true, category: 'Electronics', inStock: true, description: 'Advanced fitness tracking with heart rate monitor and GPS' },
  { id: 3, name: 'USB-C Charging Cable 6ft - Fast Charge', price: 999, originalPrice: 1599, rating: 4.3, reviews: 24567, image: '🔌', prime: false, category: 'Electronics', inStock: true, description: 'Durable braided cable with fast charging support' },
  { id: 4, name: 'Portable Power Bank 20000mAh', price: 2899, rating: 4.6, reviews: 15234, image: '🔋', prime: true, category: 'Electronics', inStock: true, description: 'High capacity power bank with dual USB ports' },
  { id: 5, name: 'Wireless Gaming Mouse - RGB', price: 1999, rating: 4.4, reviews: 9876, image: '🖱️', prime: true, category: 'Electronics', inStock: true, description: 'Ergonomic gaming mouse with customizable RGB lighting' },
  { id: 6, name: 'Mechanical Gaming Keyboard - RGB Backlit', price: 7499, originalPrice: 10999, rating: 4.7, reviews: 6543, image: '⌨️', prime: true, category: 'Electronics', inStock: true, description: 'Cherry MX switches with full RGB backlighting' },
  { id: 7, name: 'Laptop Stand - Aluminum Adjustable', price: 2499, rating: 4.6, reviews: 5432, image: '💻', prime: true, category: 'Office', inStock: true, description: 'Ergonomic laptop stand with 6 adjustable heights' },
  { id: 8, name: 'Webcam 1080p HD - Auto Focus', price: 4999, rating: 4.5, reviews: 7821, image: '📹', prime: true, category: 'Electronics', inStock: true, description: 'Full HD webcam with auto focus and noise reduction' },
  { id: 9, name: 'Desk Lamp - LED Touch Control', price: 2999, originalPrice: 3999, rating: 4.7, reviews: 4523, image: '💡', prime: false, category: 'Office', inStock: true, description: 'Modern LED desk lamp with touch controls and USB charging' },
  { id: 10, name: 'Bluetooth Speaker - Waterproof', price: 3699, rating: 4.6, reviews: 11234, image: '🔊', prime: true, category: 'Electronics', inStock: true, description: 'IPX7 waterproof speaker with 360° sound' },
  { id: 11, name: 'Phone Case - Shockproof Clear', price: 1199, rating: 4.3, reviews: 18765, image: '📱', prime: true, category: 'Accessories', inStock: true, description: 'Military grade drop protection with crystal clear design' },
  { id: 12, name: 'Screen Protector - Tempered Glass Pack', price: 799, rating: 4.4, reviews: 22341, image: '🛡️', prime: false, category: 'Accessories', inStock: true, description: 'Pack of 3 tempered glass screen protectors' },
  { id: 13, name: 'Wireless Earbuds - Touch Control', price: 3299, originalPrice: 4999, rating: 4.5, reviews: 9876, image: '🎵', prime: true, category: 'Electronics', inStock: true, description: 'True wireless earbuds with charging case' },
  { id: 14, name: 'External SSD 1TB - USB 3.2', price: 7499, rating: 4.8, reviews: 6234, image: '💾', prime: true, category: 'Electronics', inStock: true, description: 'High speed portable SSD with up to 1050MB/s transfer' },
  { id: 15, name: 'Monitor Stand - Dual Arm', price: 9999, originalPrice: 12999, rating: 4.6, reviews: 3421, image: '🖥️', prime: true, category: 'Office', inStock: true, description: 'Dual monitor mount with full motion adjustment' },
];

const SECRET_DATABASE: SecretData[] = [
  { id: 1, type: 'credit_card', data: '4532-1234-5678-9010' },
  { id: 2, type: 'credit_card', data: '5425-2334-3010-9903' },
  { id: 3, type: 'admin_password', data: 'Admin123!Secure' },
  { id: 4, type: 'api_key', data: 'sk_live_51H7xK2eZvKYlo2C' },
  { id: 5, type: 'flag', data: 'NCG{union_select_exposes_sensitive_data}' },
  { id: 6, type: 'ssn', data: '123-45-6789' },
  { id: 7, type: 'database_connection', data: 'postgres://admin:pass123@db.shophub.com:5432' },
  { id: 8, type: 'jwt_secret', data: 'supersecretkey12345678' },
];

export const SqlInjectionDump = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [secretData, setSecretData] = useState<SecretData[]>([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', 'Electronics', 'Office', 'Accessories'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    const query = searchQuery.toLowerCase();

    // Simulate SQL query construction (vulnerable!)
    const simulatedQuery = `SELECT id, name, price, rating FROM products WHERE name LIKE '%${searchQuery}%'`;
    setSqlQuery(simulatedQuery);

    // Check for UNION-based SQL injection
    const unionPattern = /union\s+select/i;
    const isUnionInjection = unionPattern.test(query);

    if (isUnionInjection) {
      // SQL Injection successful - show secret data
      setSecretData(SECRET_DATABASE);
      setSearchResults([]);
      setShowDebug(true);
    } else {
      // Normal search
      let results = MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query)
      );

      if (selectedCategory !== 'All') {
        results = results.filter(p => p.category === selectedCategory);
      }

      setSearchResults(results);
      setSecretData([]);
      setShowDebug(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl" style={{ minHeight: '600px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">ShopHub</span>
          </div>

          {/* Delivery Location */}
          <div className="hidden md:flex items-center gap-1 text-white text-xs cursor-pointer hover:outline hover:outline-1 hover:outline-white p-2 rounded">
            <MapPin className="w-4 h-4" />
            <div>
              <div className="text-gray-400">Deliver to</div>
              <div className="font-bold">Mumbai 400001</div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex">
            <div className="flex w-full max-w-3xl">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-200 px-3 py-2 text-sm text-gray-700 border-r border-gray-300 rounded-l-md focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 px-6 rounded-r-md transition-colors"
              >
                <Search className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-6 text-white text-sm">
            <div className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-2 rounded">
              <div className="text-xs">Hello, Sign in</div>
              <div className="font-bold flex items-center gap-1">
                Account & Lists <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="cursor-pointer hover:outline hover:outline-1 hover:outline-white p-2 rounded">
              <div className="text-xs">Returns</div>
              <div className="font-bold">& Orders</div>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative cursor-pointer hover:outline hover:outline-1 hover:outline-white p-2 rounded flex items-center gap-1"
            >
              <div className="relative">
                <ShoppingCart className="w-8 h-8" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="font-bold">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Nav */}
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-4 text-white text-sm">
        <button className="flex items-center gap-2 hover:outline hover:outline-1 hover:outline-white p-1 rounded">
          <Menu className="w-5 h-5" />
          All
        </button>
        <button className="hover:outline hover:outline-1 hover:outline-white p-1 rounded">Today's Deals</button>
        <button className="hover:outline hover:outline-1 hover:outline-white p-1 rounded">Customer Service</button>
        <button className="hover:outline hover:outline-1 hover:outline-white p-1 rounded">Registry</button>
        <button className="hover:outline hover:outline-1 hover:outline-white p-1 rounded">Gift Cards</button>
        <button className="hover:outline hover:outline-1 hover:outline-white p-1 rounded">Sell</button>
      </div>

      {/* SQL Query Debug Info */}
      {hasSearched && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-yellow-800 mb-1">Debug Mode (Visible in source)</div>
              <div className="font-mono text-yellow-700 bg-yellow-100 p-2 rounded">
                {sqlQuery}
              </div>
              <div className="text-yellow-600 mt-2">
                <strong>Hint:</strong> Try using UNION SELECT to extract data from other tables.
                The secret_data table has columns: id, type, data
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 bg-gray-50 min-h-[400px]">
        {!hasSearched ? (
          <div>
            <div className="text-center py-8 mb-8">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ShopHub</h2>
              <p className="text-gray-600 mb-4">Search for products or browse our featured items</p>
            </div>

            {/* Featured Products */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Deals</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_PRODUCTS.filter(p => p.originalPrice).slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="text-5xl text-center mb-2">{product.image}</div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'text-orange-400 fill-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-blue-600 ml-1">{product.reviews.toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <div className="text-xs text-red-600 font-bold mb-1">
                        {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% off
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        List: <span className="line-through">₹{product.originalPrice!.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* All Products */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">All Products</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="text-5xl text-center mb-2">{product.image}</div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'text-orange-400 fill-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-blue-600 ml-1">{product.reviews.toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      {product.originalPrice && (
                        <div className="text-xs text-red-600 font-bold mb-1">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                        </div>
                      )}
                      <div className="text-xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-500">
                          List: <span className="line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                    {product.prime && (
                      <div className="text-xs text-blue-600 font-bold mb-2">
                        prime FREE Delivery
                      </div>
                    )}
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : secretData.length > 0 ? (
          // SQL Injection successful - show secret data
          <div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-800 text-lg mb-2">SQL Injection Successful!</h3>
                  <p className="text-red-700 text-sm mb-3">
                    You've successfully exploited a SQL injection vulnerability. The application executed your malicious query and exposed sensitive data from the database.
                  </p>
                  <div className="bg-red-100 p-3 rounded font-mono text-xs text-red-900 mb-3">
                    <div>Executed Query:</div>
                    <div className="mt-1">{sqlQuery}</div>
                  </div>
                  <p className="text-red-600 text-xs">
                    <strong>Impact:</strong> Unauthorized access to sensitive customer data, payment information, and system credentials.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Extracted Sensitive Data:</h2>
            <div className="bg-white border border-red-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {secretData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">{item.id}</td>
                      <td className="px-4 py-3 text-sm border-b">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono border-b">
                        {item.type === 'flag' ? (
                          <span className="text-green-600 font-bold">{item.data}</span>
                        ) : (
                          <span className="text-gray-800">{item.data}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 font-bold mb-2">
                <span className="text-2xl">🎯</span>
                <span>Challenge Completed!</span>
              </div>
              <p className="text-green-700 text-sm">
                You found the flag in the secret_data table. Copy it and submit it to solve this challenge!
              </p>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          // Normal search results
          <div>
            <div className="mb-4 text-sm text-gray-600">
              1-{searchResults.length} of {searchResults.length} results for "{searchQuery}"
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="text-6xl text-center mb-3">{product.image}</div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-orange-400 fill-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-blue-600">{product.reviews.toLocaleString()}</span>
                  </div>
                  <div className="mb-2">
                    {product.originalPrice && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-red-600 font-bold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                        </span>
                        <span className="text-xs text-gray-500">Limited time deal</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-500">
                        List: <span className="line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                  {product.prime && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs text-blue-600 font-bold">prime</span>
                      <span className="text-xs text-gray-700">FREE Delivery Tomorrow</span>
                    </div>
                  )}
                  <div className="text-xs text-green-700 mb-3">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-500 text-gray-900 text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // No results
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No results found for "{searchQuery}"</div>
            <p className="text-sm text-gray-600">Try different keywords or check the hint above</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-4 text-xs">
        <p>© 2024 ShopHub - CTF Challenge Simulator</p>
        <p className="text-gray-400 mt-1">This is a vulnerable application for educational purposes</p>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="text-4xl">{item.product.image}</div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                              {item.product.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              {item.product.prime && (
                                <span className="text-xs text-blue-600 font-bold">prime</span>
                              )}
                              <span className="text-xs text-green-700">In Stock</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{item.product.price.toLocaleString('en-IN')}
                              </span>
                              {item.product.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{item.product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                  className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-sm text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                          <span className="text-sm text-gray-600">Subtotal: </span>
                          <span className="text-sm font-bold text-gray-900">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Subtotal ({cartItemCount} items):</span>
                      <span className="text-lg font-bold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Estimated shipping:</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="text-gray-600">Estimated tax (GST 18%):</span>
                      <span className="text-gray-900">₹{Math.round(cartTotal * 0.18).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                      <span className="text-lg font-bold text-gray-900">Order total:</span>
                      <span className="text-xl font-bold text-red-700">
                        ₹{Math.round(cartTotal + cartTotal * 0.18).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 rounded-lg transition-colors mb-2">
                    Proceed to Checkout ({cartItemCount} items)
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
