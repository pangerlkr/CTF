import { Folder, Trophy, User, Shield, Target, Globe, TrendingUp, Award, Zap, Lock, Code, ChevronRight } from 'lucide-react';
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
              <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 h-full overflow-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                      NexusCipherGuard CTF
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Master cybersecurity through immersive, hands-on challenges that simulate real-world scenarios
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            Interactive Challenges
                            <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Engage with dynamic security simulations that test your skills in real-time
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200 cursor-pointer hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            Real-World Scenarios
                            <ChevronRight className="w-4 h-4 text-cyan-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Practice on vulnerabilities found in actual production environments
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            Global Rankings
                            <ChevronRight className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Compete with security enthusiasts worldwide on the leaderboard
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 cursor-pointer hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            Track Progress
                            <ChevronRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Monitor your growth with detailed analytics and achievement badges
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Ready to Start Your Journey?</h4>
                        <p className="text-sm text-blue-100">
                          Double-click the CTF Challenges icon to begin mastering cybersecurity!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
            x: 200,
            y: 100,
            width: 700,
            height: 550,
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
