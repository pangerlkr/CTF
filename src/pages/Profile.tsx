import { useState, useEffect } from 'react';
import { User, Trophy, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase, Challenge, Solve } from '../lib/supabase';

export const Profile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [solves, setSolves] = useState<Solve[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      const [solvesResult, challengesResult] = await Promise.all([
        supabase.from('solves').select('*').eq('user_id', user.id).order('solved_at', { ascending: false }),
        supabase.from('challenges').select('*'),
      ]);

      if (solvesResult.data) setSolves(solvesResult.data);
      if (challengesResult.data) setChallenges(challengesResult.data);
      setLoading(false);
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Loading profile...</div>
      </div>
    );
  }

  const solvedChallenges = solves.map((solve) => {
    const challenge = challenges.find((c) => c.id === solve.challenge_id);
    return { ...solve, challenge };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDE2MywgMTg0LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <nav className="relative z-10 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                NEXUSCIPHERGUARD
              </span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{profile?.username}</h1>
              <p className="text-slate-400">{user?.email}</p>
              {profile?.is_admin && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-purple-400 text-sm font-medium">
                  Administrator
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-cyan-400" />
                <span className="text-slate-400">Total Points</span>
              </div>
              <p className="text-3xl font-bold text-cyan-400">{profile?.total_points || 0}</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <span className="text-slate-400">Challenges Solved</span>
              </div>
              <p className="text-3xl font-bold text-emerald-400">{solves.length}</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span className="text-slate-400">Member Since</span>
              </div>
              <p className="text-lg font-bold text-blue-400">
                {new Date(profile?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Completed Challenges</h2>

          {solvedChallenges.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No challenges solved yet. Start solving to see your progress!
            </div>
          ) : (
            <div className="space-y-4">
              {solvedChallenges.map((solve) => {
                if (!solve.challenge) return null;
                return (
                  <div
                    key={solve.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                    onClick={() => navigate(`/challenge/${solve.challenge.slug}`)}
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{solve.challenge.title}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-cyan-400">{solve.challenge.category}</span>
                        <span className="text-slate-600">•</span>
                        <span className={`${
                          solve.challenge.difficulty === 'easy' ? 'text-emerald-400' :
                          solve.challenge.difficulty === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {solve.challenge.difficulty}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">
                          {new Date(solve.solved_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-bold">+{solve.challenge.points}pts</span>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
