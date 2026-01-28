import { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface LeaderboardEntry {
  username: string;
  total_points: number;
  rank: number;
}

export const LeaderboardApp = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, total_points, rank')
        .order('total_points', { ascending: false })
        .limit(100);

      if (data) setLeaderboard(data);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="text-gray-600 font-bold w-6 text-center">{rank}</span>;
  };

  if (loading) {
    return <div className="p-6 text-center">Loading leaderboard...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-7 h-7 text-yellow-500" />
        Global Leaderboard
      </h2>
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.username}
            className={`p-4 rounded-lg flex items-center gap-4 ${
              index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(index + 1)}
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">{entry.username}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{entry.total_points}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
