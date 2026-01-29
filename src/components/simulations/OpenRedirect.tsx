import { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Globe, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  description: string;
}

export const OpenRedirect = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');

    if (redirectUrl) {
      if (redirectUrl === 'https://evil.com') {
        setMessage({
          type: 'success',
          text: 'Flag: NCG{open_redirect_validates_urls}'
        });
      } else {
        setMessage({
          type: 'error',
          text: `Redirecting to: ${redirectUrl}... (In a real scenario, this would redirect you!)`
        });
      }
    }
  }, []);

  const generateMockResults = (query: string): SearchResult[] => {
    const results: SearchResult[] = [
      {
        title: `${query} - Official Website`,
        url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `The official website for ${query}. Get the latest information, updates, and resources about ${query}.`
      },
      {
        title: `${query} - Wikipedia`,
        url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
        description: `Learn about ${query} from the free encyclopedia. Comprehensive information and detailed articles.`
      },
      {
        title: `${query} Guide: Everything You Need to Know`,
        url: `https://www.guides.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Complete guide to ${query}. Expert tips, tutorials, and best practices for beginners and professionals.`
      },
      {
        title: `Top 10 ${query} Resources`,
        url: `https://www.resources.com/top-${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Discover the best resources for ${query}. Curated list of tools, websites, and services.`
      },
      {
        title: `${query} News and Updates`,
        url: `https://news.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Latest news and updates about ${query}. Stay informed with breaking news and trending stories.`
      }
    ];
    return results;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      setHasSearched(true);
      setSearchResults(generateMockResults(searchQuery));

      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');

      if (redirectUrl) {
        if (redirectUrl === 'https://evil.com') {
          setMessage({
            type: 'success',
            text: 'Flag: NCG{open_redirect_validates_urls}'
          });
        } else {
          setMessage({
            type: 'error',
            text: `Redirecting to: ${redirectUrl}... (In a real scenario, this would redirect you!)`
          });
        }
      }
    }
  };

  const handleTrendingClick = (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
    setSearchResults(generateMockResults(query));

    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');

    if (redirectUrl) {
      if (redirectUrl === 'https://evil.com') {
        setMessage({
          type: 'success',
          text: 'Flag: NCG{open_redirect_validates_urls}'
        });
      } else {
        setMessage({
          type: 'error',
          text: `Redirecting to: ${redirectUrl}... (In a real scenario, this would redirect you!)`
        });
      }
    }
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

        {hasSearched && searchResults.length > 0 ? (
          <div className="space-y-4">
            <div className="text-gray-600 text-sm mb-4">
              About {searchResults.length} results for <strong>{searchQuery}</strong>
            </div>
            {searchResults.map((result, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="text-lg text-blue-600 group-hover:underline font-medium">
                      {result.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm text-green-700 mb-1">{result.url}</div>
                  <p className="text-sm text-gray-700">{result.description}</p>
                </a>
              </div>
            ))}

            <button
              onClick={() => {
                setHasSearched(false);
                setSearchResults([]);
                setSearchQuery('');
              }}
              className="mt-6 text-blue-600 hover:underline text-sm"
            >
              ← Back to home
            </button>
          </div>
        ) : (
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
        )}

        {!hasSearched && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
