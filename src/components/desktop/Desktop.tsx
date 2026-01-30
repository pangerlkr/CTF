import { Folder, Trophy, User, Shield, Target, Globe, TrendingUp, Award, Zap, Lock, Code, ChevronRight, MessageSquare, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
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
  support: IconPosition;
  contact: IconPosition;
}

const DEFAULT_POSITIONS: IconPositions = {
  challenges: { x: 16, y: 16 },
  profile: { x: 16, y: 120 },
  leaderboard: { x: 16, y: 224 },
  about: { x: 16, y: 328 },
  support: { x: 16, y: 432 },
  contact: { x: 16, y: 536 },
};

export const Desktop = () => {
  const { windows, openWindow } = useWindows();
  const [iconPositions, setIconPositions] = useState<IconPositions>(() => {
    const saved = localStorage.getItem('desktop-icon-positions');
    return saved ? JSON.parse(saved) : DEFAULT_POSITIONS;
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

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
      <DesktopIcon
        icon={<MessageSquare className="w-12 h-12" />}
        label="Support"
        onDoubleClick={() => {
          setFormSubmitted(false);
          openWindow({
            title: 'Support Center',
            icon: <MessageSquare className="w-4 h-4" />,
            content: (
              <div className="p-8 bg-gradient-to-br from-slate-50 to-emerald-50 h-full overflow-auto">
                <div className="max-w-xl mx-auto">
                  {!formSubmitted ? (
                    <>
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
                          <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                          How Can We Help?
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          Send us your questions, feedback, or report any issues you're experiencing
                        </p>
                      </div>

                      <form
                        name="support"
                        method="POST"
                        data-netlify="true"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          fetch('/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams(new FormData(form) as any).toString()
                          }).then(() => setFormSubmitted(true)).catch(() => alert('Error submitting form'));
                        }}
                        className="space-y-5"
                      >
                        <input type="hidden" name="form-name" value="support" />

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            name="subject"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            placeholder="How can we help you?"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Message
                          </label>
                          <textarea
                            name="message"
                            required
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                            placeholder="Tell us more about your inquiry..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <Send className="w-5 h-5" />
                          Send Message
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for contacting us. We'll get back to you as soon as possible.
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Send Another Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ),
            x: 250,
            y: 120,
            width: 600,
            height: 650,
          });
        }}
        position={iconPositions.support}
        onPositionChange={(pos) => updateIconPosition('support', pos)}
      />
      <DesktopIcon
        icon={<Mail className="w-12 h-12" />}
        label="Contact Us"
        onDoubleClick={() => {
          openWindow({
            title: 'Contact Information',
            icon: <Mail className="w-4 h-4" />,
            content: (
              <div className="p-8 bg-gradient-to-br from-slate-50 to-violet-50 h-full overflow-auto">
                <div className="max-w-lg mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-4 shadow-lg">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                      Get In Touch
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      We're here to help. Reach out to us through any of these channels
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-violet-200 cursor-pointer hover:-translate-y-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-500 mb-1">
                            Primary Email
                          </h3>
                          <a
                            href="mailto:support@nexuscipherguard.in"
                            className="text-lg font-medium text-gray-900 hover:text-violet-600 transition-colors"
                          >
                            support@nexuscipherguard.in
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-fuchsia-200 cursor-pointer hover:-translate-y-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-500 mb-1">
                            CTF Support Email
                          </h3>
                          <a
                            href="mailto:support@ctf.nexuscipherguard.in"
                            className="text-lg font-medium text-gray-900 hover:text-fuchsia-600 transition-colors"
                          >
                            support@ctf.nexuscipherguard.in
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer hover:-translate-y-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-500 mb-1">
                            Phone Support
                          </h3>
                          <a
                            href="tel:+918132872135"
                            className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors"
                          >
                            +91 8132872135
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Need Immediate Assistance?</h4>
                        <p className="text-sm text-violet-100">
                          Use our Support Center to send us a detailed message and we'll respond within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
            x: 300,
            y: 140,
            width: 600,
            height: 600,
          });
        }}
        position={iconPositions.contact}
        onPositionChange={(pos) => updateIconPosition('contact', pos)}
      />

      {windows.map(window => (
        <Window key={window.id} window={window} />
      ))}

      <Taskbar />
    </div>
  );
};
