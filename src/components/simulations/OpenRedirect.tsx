import { useState } from 'react';
import { Search, TrendingUp, Clock, Globe, AlertCircle, CheckCircle } from 'lucide-react';

export const OpenRedirect = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const trendingSearches = [
    'Best restaurants near me',
    'Weather forecast',
    'Breaking news today',
    'Online shopping deals',
    'Movie reviews 2024',
  ];

  const recentSearches = [
    'JavaScript tutorials',
    'Healthy recipes',
    'Travel destinations',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');

    if (redirectUrl) {
      if (redirectUrl === 'https://evil.com') {
        setMessage({
          type: 'success',
          text: 'Flag: NCG{open_redirect_validates_urls}'
        });
        return;
      }

      setMessage({
        type: 'error',
        text: `Redirecting to: ${redirectUrl}... (In a real scenario, this would redirect you!)`
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Try adding a redirect parameter to the URL: ?redirect=https://evil.com'
      });
    }
  };

  const handleTrendingClick = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">SearchHub</h1>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the web..."
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-transparent focus:border-white focus:outline-none text-gray-800 text-lg shadow-lg"
            />
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-700 text-white font-medium rounded-full hover:bg-blue-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="p-6">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3>Trending Searches</h3>
            </div>
            <div className="space-y-2">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(search)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500 font-bold">{index + 1}</span>
                    <span>{search}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3>Recent Searches</h3>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(search)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{search}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm mb-2">
            <strong>Challenge Hint:</strong> This website has an open redirect vulnerability
          </p>
          <p className="text-yellow-700 text-xs mb-2">
            Try adding a <code className="bg-yellow-100 px-1 rounded">?redirect=https://evil.com</code> parameter to the URL
          </p>
          <p className="text-yellow-700 text-xs">
            Example: <code className="bg-yellow-100 px-1 rounded">?redirect=https://evil.com</code>
          </p>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-xs">
            <strong>Security Note:</strong> Real applications should validate redirect URLs and only allow whitelisted domains
          </p>
        </div>
      </div>
    </div>
  );
};
