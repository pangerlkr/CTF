import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, Search, PlusSquare, User, LogOut, CheckCircle, AlertCircle, Lock } from 'lucide-react';

interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  caption: string;
  timestamp: string;
  isLiked: boolean;
}

interface Account {
  username: string;
  password: string;
  isPrivate: boolean;
  bio: string;
}

const ACCOUNTS: Account[] = [
  { username: 'alice_wonder', password: 'password123', isPrivate: false, bio: 'Travel enthusiast' },
  { username: 'admin_user', password: 'admin2024', isPrivate: true, bio: 'System Administrator - Flag: NCG{session_reuse_after_logout}' },
  { username: 'bob_dev', password: 'bobpass', isPrivate: false, bio: 'Full stack developer' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    username: 'alice_wonder',
    avatar: '👩',
    image: '/family.jpeg',
    likes: 234,
    caption: 'Beautiful sunrise this morning!',
    timestamp: '2h ago',
    isLiked: false,
  },
  {
    id: 2,
    username: 'bob_dev',
    avatar: '👨',
    image: '/summer-vacation.jpeg',
    likes: 156,
    caption: 'Coding session in progress',
    timestamp: '4h ago',
    isLiked: false,
  },
];

export const SessionFixation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [view, setView] = useState<'login' | 'feed' | 'profile'>('login');
  const [viewingProfile, setViewingProfile] = useState<Account | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('instagram_session');
    if (savedToken && !isLoggedIn) {
      showMessage('info', 'Found a session token in browser storage...');
    }
  }, [isLoggedIn]);

  const generateToken = (username: string) => {
    return `session_${username}_${Date.now()}`;
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogin = () => {
    const account = ACCOUNTS.find(
      acc => acc.username === username && acc.password === password
    );

    if (account) {
      const token = generateToken(account.username);
      setSessionToken(token);
      localStorage.setItem('instagram_session', token);
      localStorage.setItem('instagram_user', account.username);
      setCurrentUser(account);
      setIsLoggedIn(true);
      setView('feed');
      showMessage('success', `Welcome back, ${account.username}!`);
      setUsername('');
      setPassword('');
    } else {
      showMessage('error', 'Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('login');
    showMessage('info', 'Logged out successfully. Session token remains in browser storage.');
  };

  const handleReuseSession = () => {
    const savedToken = localStorage.getItem('instagram_session');
    const savedUsername = localStorage.getItem('instagram_user');

    if (savedToken && savedUsername) {
      const account = ACCOUNTS.find(acc => acc.username === savedUsername);
      if (account) {
        setSessionToken(savedToken);
        setCurrentUser(account);
        setIsLoggedIn(true);
        setView('feed');
        showMessage('success', 'Session reused! Vulnerability exploited successfully.');
      }
    } else {
      showMessage('error', 'No session token found');
    }
  };

  const handleLike = (postId: number) => {
    if (!isLoggedIn) {
      showMessage('error', 'Please login to like posts');
      return;
    }
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const viewProfile = (username: string) => {
    const account = ACCOUNTS.find(acc => acc.username === username);
    if (account) {
      if (account.isPrivate && currentUser?.username !== account.username) {
        showMessage('error', 'This account is private. Login to view.');
        return;
      }
      setViewingProfile(account);
      setView('profile');
    }
  };

  const renderLogin = () => (
    <div className="w-full max-w-sm mx-auto py-8">
      <div className="bg-white border border-slate-300 rounded-lg p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text mb-2">
            Nexusgram
          </div>
          <p className="text-slate-600 text-sm">Share your moments</p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> :
             message.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> :
             <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-400 bg-slate-50"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-400 bg-slate-50"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Log In
        </button>

        {localStorage.getItem('instagram_session') && (
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500">OR</span>
              </div>
            </div>

            <button
              onClick={handleReuseSession}
              className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm shadow-lg"
            >
              Reuse Old Session Token
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 bg-white border border-slate-300 rounded-lg p-4 shadow-sm text-center text-sm text-slate-600">
        <strong>Test accounts:</strong><br/>
        alice_wonder / password123<br/>
        admin_user / admin2024
      </div>
    </div>
  );

  const renderFeed = () => (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white border-b border-slate-300 px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text">
          Nexusgram
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {message && (
        <div className={`mx-4 mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> :
           message.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> :
           <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="mt-4 space-y-6 pb-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white border border-slate-300 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => viewProfile(post.username)}
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white">
                  {post.avatar}
                </div>
                <span className="font-semibold text-sm">{post.username}</span>
              </button>
              <button className="text-slate-600 hover:text-slate-900">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 aspect-square">
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <Heart
                      className={`w-7 h-7 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-slate-900'}`}
                    />
                  </button>
                  <button className="hover:opacity-70 transition-opacity">
                    <MessageCircle className="w-7 h-7" />
                  </button>
                  <button className="hover:opacity-70 transition-opacity">
                    <Send className="w-7 h-7" />
                  </button>
                </div>
                <button className="hover:opacity-70 transition-opacity">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>

              <div className="text-sm">
                <span className="font-semibold">{post.likes} likes</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold mr-2">{post.username}</span>
                <span>{post.caption}</span>
              </div>

              <div className="text-xs text-slate-500">{post.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-slate-300 px-4 py-3 flex justify-around mt-4">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Home className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Search className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <PlusSquare className="w-6 h-6" />
        </button>
        <button
          onClick={() => viewProfile(currentUser?.username || '')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!viewingProfile) return null;

    const isOwnProfile = currentUser?.username === viewingProfile.username;
    const canView = !viewingProfile.isPrivate || isOwnProfile;

    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white border-b border-slate-300 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setView('feed')}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Back
          </button>
          <div className="font-semibold">{viewingProfile.username}</div>
          <div className="w-16"></div>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-4xl">
              {viewingProfile.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold">{viewingProfile.username}</h2>
                {viewingProfile.isPrivate && (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div className="flex gap-4 text-sm">
                <span><strong>42</strong> posts</span>
                <span><strong>1.2k</strong> followers</span>
                <span><strong>543</strong> following</span>
              </div>
            </div>
          </div>

          {canView ? (
            <div className="space-y-4">
              <p className="text-sm">{viewingProfile.bio}</p>
              {viewingProfile.bio.includes('Flag:') && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-700">
                    <strong>Success!</strong> You found the admin's private profile by reusing their session token after logout!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <Lock className="w-12 h-12 mx-auto text-slate-400" />
              <h3 className="font-semibold">This Account is Private</h3>
              <p className="text-sm text-slate-600">Follow this account to see their photos and videos.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-300 overflow-hidden min-h-[600px]">
      {!isLoggedIn && renderLogin()}
      {isLoggedIn && view === 'feed' && renderFeed()}
      {isLoggedIn && view === 'profile' && renderProfile()}
    </div>
  );
};
