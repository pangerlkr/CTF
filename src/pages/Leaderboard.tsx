import { useState, useEffect } from 'react';
import { Shield, Trophy, Medal, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase, LeaderboardEntry } from '../lib/supabase';

export const Leaderboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('username, total_points')
        .order('total_points', { ascending: false })
        .limit(100);

      if (profiles) {
        const enrichedData = await Promise.all(
          profiles.map(async (profile) => {
            const { count } = await supabase
              .from('solves')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', (await supabase
                .from('profiles')
                .select('id')
                .eq('username', profile.username)
                .maybeSingle()
              ).data?.id || '');

            const { data: lastSolve } = await supabase
              .from('solves')
              .select('solved_at')
              .eq('user_id', (await supabase
                .from('profiles')
                .select('id')
                .eq('username', profile.username)
                .maybeSingle()
              ).data?.id || '')
              .order('solved_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              username: profile.username,
              total_points: profile.total_points,
              solve_count: count || 0,
              last_solve: lastSolve?.solved_at || null,
            };
          })
        );

        setLeaderboard(enrichedData);
      }

      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDE2MywgMTg0LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <nav className="relative z-10 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/')}
              className="flex items-center gap-3"
            >
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                NEXUSCIPHERGUARD
              </span>
            </button>
            <div className="flex gap-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/challenges')}
                    className="text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Challenges
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-slate-400">Top performers in cybersecurity challenges</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-cyan-400">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No users on the leaderboard yet</div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-cyan-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Username</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Points</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Solves</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Last Solve</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <tr
                        key={entry.username}
                        className={`border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors ${
                          rank <= 3 ? 'bg-slate-900/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getRankIcon(rank)}
                            <span className={`font-bold ${
                              rank === 1 ? 'text-yellow-400' :
                              rank === 2 ? 'text-slate-300' :
                              rank === 3 ? 'text-orange-400' :
                              'text-slate-400'
                            }`}>
                              #{rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">{entry.username}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-cyan-400 font-bold">{entry.total_points}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-slate-300">{entry.solve_count}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-slate-400 text-sm">
                            {entry.last_solve
                              ? new Date(entry.last_solve).toLocaleDateString()
                              : '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
