import { useState, useEffect } from 'react';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { supabase, Challenge, Solve } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from '../../../hooks/useNavigate';

export const ChallengesApp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [solves, setSolves] = useState<Solve[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [challengesResult, solvesResult] = await Promise.all([
        supabase.from('challenges').select('*').eq('is_active', true),
        supabase.from('solves').select('*').eq('user_id', user.id),
      ]);

      if (challengesResult.data) setChallenges(challengesResult.data);
      if (solvesResult.data) setSolves(solvesResult.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const solvedChallengeIds = new Set(solves.map(s => s.challenge_id));

  const openChallenge = (challenge: Challenge) => {
    navigate(`/challenge/${challenge.slug}`);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading challenges...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">CTF Challenges</h2>
      <div className="space-y-2">
        {challenges.map(challenge => (
          <div
            key={challenge.id}
            className={`p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
              solvedChallengeIds.has(challenge.id) ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onDoubleClick={() => openChallenge(challenge)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{challenge.title}</h3>
                {solvedChallengeIds.has(challenge.id) && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {challenge.category} • {challenge.difficulty} • {challenge.points}pts
              </div>
            </div>
            <button
              onClick={() => openChallenge(challenge)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
