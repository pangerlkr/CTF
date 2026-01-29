import { Folder, Trophy, User, Shield } from 'lucide-react';
import { useWindows } from '../../contexts/WindowContext';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { DesktopIcon } from './DesktopIcon';
import { ChallengesApp } from './apps/ChallengesApp';
import { ProfileApp } from './apps/ProfileApp';
import { LeaderboardApp } from './apps/LeaderboardApp';
import { useState, useEffect } from 'react';

interface IconPosition {
  x: number;
  y: number;
}

interface IconPositions {
  challenges: IconPosition;
  profile: IconPosition;
  leaderboard: IconPosition;
  about: IconPosition;
}

const DEFAULT_POSITIONS: IconPositions = {
  challenges: { x: 16, y: 16 },
  profile: { x: 16, y: 120 },
  leaderboard: { x: 16, y: 224 },
  about: { x: 16, y: 328 },
};

export const Desktop = () => {
  const { windows, openWindow } = useWindows();
  const [iconPositions, setIconPositions] = useState<IconPositions>(() => {
    const saved = localStorage.getItem('desktop-icon-positions');
    return saved ? JSON.parse(saved) : DEFAULT_POSITIONS;
  });

  useEffect(() => {
    localStorage.setItem('desktop-icon-positions', JSON.stringify(iconPositions));
  }, [iconPositions]);

  const updateIconPosition = (iconKey: keyof IconPositions, position: IconPosition) => {
    setIconPositions(prev => ({ ...prev, [iconKey]: position }));
  };

  const handleOpenChallenges = () => {
    openWindow({
      title: 'CTF Challenges',
      icon: <Folder className="w-4 h-4" />,
      content: <ChallengesApp />,
      x: 100,
      y: 80,
      width: 800,
      height: 600,
    });
  };

  const handleOpenProfile = () => {
    openWindow({
      title: 'My Profile',
      icon: <User className="w-4 h-4" />,
      content: <ProfileApp />,
      x: 150,
      y: 100,
      width: 600,
      height: 500,
    });
  };

  const handleOpenLeaderboard = () => {
    openWindow({
      title: 'Leaderboard',
      icon: <Trophy className="w-4 h-4" />,
      content: <LeaderboardApp />,
      x: 200,
      y: 120,
      width: 700,
      height: 600,
    });
  };

  return (
    <div
      className="relative w-full h-screen bg-center overflow-hidden"
      style={{
        backgroundImage: `url('/logo.jpeg')`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      <DesktopIcon
        icon={<Folder className="w-12 h-12" />}
        label="CTF Challenges"
        onDoubleClick={handleOpenChallenges}
        position={iconPositions.challenges}
        onPositionChange={(pos) => updateIconPosition('challenges', pos)}
      />
      <DesktopIcon
        icon={<User className="w-12 h-12" />}
        label="My Profile"
        onDoubleClick={handleOpenProfile}
        position={iconPositions.profile}
        onPositionChange={(pos) => updateIconPosition('profile', pos)}
      />
      <DesktopIcon
        icon={<Trophy className="w-12 h-12" />}
        label="Leaderboard"
        onDoubleClick={handleOpenLeaderboard}
        position={iconPositions.leaderboard}
        onPositionChange={(pos) => updateIconPosition('leaderboard', pos)}
      />
      <DesktopIcon
        icon={<Shield className="w-12 h-12" />}
        label="About CTF"
        onDoubleClick={() => {
          openWindow({
            title: 'About NexusCipherGuard',
            icon: <Shield className="w-4 h-4" />,
            content: (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">NexusCipherGuard CTF Platform</h2>
                <p className="mb-4">
                  Welcome to NexusCipherGuard, a comprehensive Capture The Flag platform designed to help you
                  master cybersecurity skills through hands-on challenges.
                </p>
                <div className="space-y-2">
                  <h3 className="font-bold">Features:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Interactive security challenges</li>
                    <li>Real-world vulnerability scenarios</li>
                    <li>Global leaderboard rankings</li>
                    <li>Progress tracking and achievements</li>
                  </ul>
                </div>
              </div>
            ),
            x: 250,
            y: 150,
            width: 500,
            height: 400,
          });
        }}
        position={iconPositions.about}
        onPositionChange={(pos) => updateIconPosition('about', pos)}
      />

      {windows.map(window => (
        <Window key={window.id} window={window} />
      ))}

      <Taskbar />
    </div>
  );
};
