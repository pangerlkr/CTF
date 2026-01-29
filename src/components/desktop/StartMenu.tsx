import { LogOut, User, Trophy, Target, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from '../../hooks/useNavigate';

interface StartMenuProps {
  onClose: () => void;
}

export const StartMenu = ({ onClose }: StartMenuProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    onClose();
  };

  const menuItems = [
    { icon: <Target className="w-5 h-5" />, label: 'Challenges', onClick: () => { navigate('/challenges'); onClose(); } },
    { icon: <Trophy className="w-5 h-5" />, label: 'Leaderboard', onClick: () => { navigate('/leaderboard'); onClose(); } },
    { icon: <User className="w-5 h-5" />, label: 'Profile', onClick: () => { navigate('/profile'); onClose(); } },
  ];

  if (profile?.is_admin) {
    menuItems.push({ icon: <Settings className="w-5 h-5" />, label: 'Admin', onClick: () => { navigate('/admin'); onClose(); } });
  }

  return (
    <div className="absolute bottom-12 left-0 w-80 bg-gradient-to-b from-blue-500 to-blue-600 border-2 border-blue-700 rounded-tr-lg shadow-2xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-white">
            <div className="font-bold">{profile?.username}</div>
            <div className="text-xs opacity-90">Online</div>
          </div>
        </div>
      </div>

      <div className="p-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-400 rounded transition-colors"
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-blue-700 p-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500 rounded transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};
