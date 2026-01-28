import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { WindowProvider } from '../contexts/WindowContext';
import { Desktop } from '../components/desktop/Desktop';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <WindowProvider>
      <Desktop />
    </WindowProvider>
  );
};
