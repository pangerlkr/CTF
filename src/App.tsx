import { AuthProvider } from './contexts/AuthContext';
import { useLocation } from './hooks/useNavigate';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Challenges } from './pages/Challenges';
import { ChallengeDetail } from './pages/ChallengeDetail';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

function Router() {
  const { pathname } = useLocation();

  if (pathname === '/login') return <Login />;
  if (pathname === '/register') return <Register />;
  if (pathname === '/forgot-password') return <ForgotPassword />;
  if (pathname === '/dashboard') return <Dashboard />;
  if (pathname === '/challenges') return <Challenges />;
  if (pathname.startsWith('/challenge/')) return <ChallengeDetail />;
  if (pathname === '/leaderboard') return <Leaderboard />;
  if (pathname === '/profile') return <Profile />;
  if (pathname === '/admin') return <Admin />;

  return <Landing />;
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
