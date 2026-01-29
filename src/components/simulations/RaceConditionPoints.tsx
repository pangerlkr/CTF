import { useState, useEffect } from 'react';
import { Zap, Award, RefreshCw, AlertTriangle } from 'lucide-react';

export const RaceConditionPoints = () => {
  const [points, setPoints] = useState(100);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [redeemCount, setRedeemCount] = useState(0);
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  const simulateServerDelay = () => {
    return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  };

  const redeemPoints = async () => {
    if (points < 50) {
      setMessage({ type: 'error', text: 'Insufficient points! You need at least 50 points to redeem.' });
      return;
    }

    setIsRedeeming(true);
    setPendingRequests(prev => prev + 1);
    setMessage({ type: 'info', text: 'Processing redemption...' });

    const currentPoints = points;

    await simulateServerDelay();

    if (currentPoints >= 50) {
      setPoints(prev => prev - 50);
      setRedeemCount(prev => prev + 1);
      setMessage({ type: 'success', text: '50 points redeemed! You earned a reward.' });
    }

    setPendingRequests(prev => prev - 1);
    setIsRedeeming(false);
  };

  const redeemMultipleTimes = async (times: number) => {
    setMessage({ type: 'info', text: `Sending ${times} concurrent redemption requests...` });

    const promises = [];
    for (let i = 0; i < times; i++) {
      promises.push(redeemPoints());
    }

    await Promise.all(promises);
  };

  const resetAccount = () => {
    setPoints(100);
    setRedeemCount(0);
    setMessage(null);
    setFlagRevealed(false);
    setPendingRequests(0);
  };

  useEffect(() => {
    if (redeemCount >= 3 && points >= 0) {
      setFlagRevealed(true);
    }
  }, [redeemCount, points]);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-cyan-500/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Award className="w-5 h-5" />
          Loyalty Points System
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
          <div className="text-slate-400 text-sm mb-2">Your Points Balance</div>
          <div className="text-5xl font-bold text-cyan-400 mb-2">{points}</div>
          <div className="text-slate-400 text-xs">
            {pendingRequests > 0 && (
              <span className="text-yellow-400 flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                {pendingRequests} request{pendingRequests > 1 ? 's' : ''} in progress
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-semibold text-yellow-400 mb-1">Redeem Your Points</p>
              <p>Exchange 50 points for exclusive rewards. Each redemption requires 50 points.</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : message.type === 'error'
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => redeemPoints()}
            disabled={isRedeeming || points < 50}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Redeem 50 Points
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => redeemMultipleTimes(3)}
              disabled={isRedeeming || points < 50}
              className="py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spam 3x
            </button>
            <button
              onClick={() => redeemMultipleTimes(5)}
              disabled={isRedeeming || points < 50}
              className="py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spam 5x
            </button>
            <button
              onClick={() => redeemMultipleTimes(10)}
              disabled={isRedeeming || points < 50}
              className="py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spam 10x
            </button>
          </div>

          <button
            onClick={resetAccount}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Account
          </button>
        </div>

        <div className="border-t border-slate-700 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Redemptions:</span>
            <span className="text-white font-semibold">{redeemCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Points Spent:</span>
            <span className="text-white font-semibold">{redeemCount * 50}</span>
          </div>
        </div>

        {flagRevealed && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-emerald-400 text-sm text-center font-medium mb-2">
              Race condition exploited! You redeemed more than your balance should allow.
            </p>
            <p className="text-emerald-400 text-center font-medium mb-2">
              Here's your flag:
            </p>
            <p className="text-emerald-400 text-center text-sm font-mono bg-slate-900/50 p-3 rounded">
              NCG{`{r4c3_c0nd1t10n_p01nt5_dupl1c4t3d}`}
            </p>
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-xs leading-relaxed">
            <span className="text-cyan-400 font-semibold">Hint:</span> The server checks your balance before deducting points,
            but there's a delay in processing. What happens if you send multiple requests at the same time?
          </p>
        </div>
      </div>
    </div>
  );
};
