import { useState, useEffect } from 'react';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { supabase, Challenge, Solve } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useWindows } from '../../../contexts/WindowContext';

export const ChallengesApp = () => {
  const { user } = useAuth();
  const { openWindow, closeWindow } = useWindows();
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

  const openChallengeWindow = async (challenge: Challenge) => {
    const challengeModule = await import(`../../simulations/${challenge.component_name}.tsx`);
    const ChallengeComponent = challengeModule[challenge.component_name];

    openWindow({
      title: challenge.title,
      icon: <Play className="w-4 h-4" />,
      content: (
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">{challenge.title}</h2>
              <span className={`px-3 py-1 rounded text-sm ${
                challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {challenge.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{challenge.category}</span>
              <span>{challenge.points} points</span>
            </div>
          </div>
          <div className="prose max-w-none mb-6">
            <p>{challenge.description}</p>
          </div>
          <ChallengeComponent challengeId={challenge.id} />
        </div>
      ),
      x: 100,
      y: 100,
      width: 800,
      height: 600,
    });
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
            onDoubleClick={() => openChallengeWindow(challenge)}
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
              onClick={() => openChallengeWindow(challenge)}
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
