import { Shield, Target, Trophy, Users } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDE2MywgMTg0LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <nav className="relative z-10 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo-nexus.png" alt="Logo" className="w-10 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                NEXUSCIPHERGUARD INDIA
              </span>
            </div>
            <div className="flex gap-3">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/50"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/50"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse"></div>
                <h1 className="relative text-6xl font-bold text-white mb-4">
                  Master Cybersecurity
                  <span className="block text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text animate-gradient">
                    Through Real Challenges
                  </span>
                </h1>
              </div>
            </div>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Train in a safe, sandboxed environment with real-world vulnerabilities.
              Sharpen your skills through Capture The Flag challenges designed for ethical hackers.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              {!user && (
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-xl shadow-cyan-500/50 hover:shadow-cyan-400/60 hover:scale-105"
                >
                  Get Started
                </button>
              )}
              <button
                onClick={() => navigate('/challenges')}
                className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 text-lg rounded-lg hover:bg-cyan-500/10 transition-all duration-200"
              >
                Explore Challenges
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="px-8 py-4 border-2 border-blue-500 text-blue-400 text-lg rounded-lg hover:bg-blue-500/10 transition-all duration-200"
              >
                Leaderboard
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-200 group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">30+ Challenges</h3>
              <p className="text-slate-400">Web exploitation, API security, cryptography, forensics and more</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-200 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Safe Environment</h3>
              <p className="text-slate-400">Practice on sandboxed vulnerable applications without risk</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-200 group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Competitive</h3>
              <p className="text-slate-400">Compete with others and climb the leaderboard</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-400/50 transition-all duration-200 group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn Together</h3>
              <p className="text-slate-400">Join a community of ethical hackers and security enthusiasts</p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Test Your Skills?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join NEXUSCIPHERGUARD INDIA and start your cybersecurity journey today
            </p>
            {!user && (
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-xl shadow-cyan-500/50 hover:scale-105"
              >
                Create Free Account
              </button>
            )}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p className="text-sm">
              Powered by <span className="text-cyan-400 font-semibold">NEXUSCIPHERGUARD INDIA</span>
            </p>
            <p className="text-xs mt-2">
              All challenges are for educational purposes only. Unauthorized access to computer systems is illegal.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
