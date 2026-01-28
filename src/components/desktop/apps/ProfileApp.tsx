import { Trophy, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase, Solve } from '../../../lib/supabase';

export const ProfileApp = () => {
  const { user, profile } = useAuth();
  const [solves, setSolves] = useState<Solve[]>([]);

  useEffect(() => {
    const fetchSolves = async () => {
      if (!user) return;
      const { data } = await supabase.from('solves').select('*').eq('user_id', user.id);
      if (data) setSolves(data);
    };
    fetchSolves();
  }, [user]);

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">{profile?.username}</h1>
        <p className="text-blue-100">{user?.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{profile?.total_points || 0}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{solves.length}</div>
          <div className="text-sm text-gray-600">Challenges Solved</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">#{profile?.rank || 'N/A'}</div>
          <div className="text-sm text-gray-600">Global Rank</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Recent Solves</h2>
        <div className="space-y-2">
          {solves.slice(0, 10).map(solve => (
            <div key={solve.id} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-medium">Challenge #{solve.challenge_id}</span>
                <span className="text-sm text-gray-500">
                  {new Date(solve.solved_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {solves.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No solves yet. Start solving challenges!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
