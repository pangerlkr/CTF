import { useState } from 'react';
import { Trophy, Gift, ShoppingBag, CreditCard, Star, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface Purchase {
  id: number;
  name: string;
  cost: number;
  icon: string;
}

interface Reward {
  id: number;
  name: string;
  points: number;
  icon: string;
  description: string;
}

const PURCHASES: Purchase[] = [
  { id: 1, name: 'Coffee', cost: 5, icon: '☕' },
  { id: 2, name: 'Sandwich', cost: 8, icon: '🥪' },
  { id: 3, name: 'Pizza', cost: 12, icon: '🍕' },
  { id: 4, name: 'Burger', cost: 10, icon: '🍔' },
];

const REWARDS: Reward[] = [
  { id: 1, name: 'Free Coffee', points: 50, icon: '☕', description: 'Redeem for a free coffee' },
  { id: 2, name: 'Free Meal', points: 100, icon: '🍔', description: 'Redeem for any meal' },
  { id: 3, name: '$10 Gift Card', points: 200, icon: '💳', description: 'Get a $10 gift card' },
  { id: 4, name: 'Premium Member', points: 500, icon: '👑', description: 'Unlock premium benefits' },
];

export const RaceConditionPoints = () => {
  const [points, setPoints] = useState(0);
  const [balance, setBalance] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [view, setView] = useState<'shop' | 'rewards'>('shop');

  const addTransaction = (text: string) => {
    setTransactions(prev => [text, ...prev].slice(0, 5));
  };

  const makePurchase = async (purchase: Purchase) => {
    if (balance < purchase.cost) {
      setMessage({ type: 'error', text: 'Insufficient balance!' });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setProcessing(true);

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check balance again (race condition vulnerability - points can be earned before balance check)
    if (balance < purchase.cost) {
      setMessage({ type: 'error', text: 'Insufficient balance!' });
      setProcessing(false);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setBalance(prev => prev - purchase.cost);
    const earnedPoints = purchase.cost * 10;
    setPoints(prev => prev + earnedPoints);
    addTransaction(`Purchased ${purchase.name} - Earned ${earnedPoints} points`);
    setMessage({ type: 'success', text: `Purchased ${purchase.name}! Earned ${earnedPoints} points!` });
    setProcessing(false);
    setTimeout(() => setMessage(null), 2000);
  };

  const redeemReward = async (reward: Reward) => {
    if (processing) return;

    setProcessing(true);

    // Simulate async operation (race condition vulnerability)
    await new Promise(resolve => setTimeout(resolve, 800));

    if (points < reward.points) {
      setMessage({ type: 'error', text: 'Not enough points!' });
      setProcessing(false);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    setPoints(prev => prev - reward.points);
    addTransaction(`Redeemed ${reward.name} for ${reward.points} points`);

    if (points >= 1000) {
      setMessage({
        type: 'success',
        text: 'Congratulations! You exploited the race condition! Flag: NCG{race_condition_points_duplication}'
      });
    } else {
      setMessage({ type: 'success', text: `Redeemed ${reward.name}!` });
      setTimeout(() => setMessage(null), 2000);
    }

    setProcessing(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-2xl flex items-center gap-2">
              <Star className="w-6 h-6" />
              Loyalty Rewards Club
            </h3>
            <p className="text-purple-100 text-sm mt-1">Earn points on every purchase!</p>
          </div>
          <div className="text-right">
            <div className="text-purple-100 text-sm">Your Points</div>
            <div className="text-white font-bold text-3xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-300" />
              {points}
            </div>
          </div>
        </div>
      </div>

      {/* Balance & Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-400" />
            <span className="text-slate-300 text-sm">Account Balance:</span>
            <span className="text-white font-bold text-lg">${balance.toFixed(2)}</span>
          </div>
          {processing && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <Zap className="w-4 h-4 animate-pulse" />
              Processing...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView('shop')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              view === 'shop'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Shop
          </button>
          <button
            onClick={() => setView('rewards')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              view === 'rewards'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Gift className="w-4 h-4 inline mr-2" />
            Rewards
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Shop View */}
        {view === 'shop' && (
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Available Items</h4>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PURCHASES.map(purchase => (
                <button
                  key={purchase.id}
                  onClick={() => makePurchase(purchase)}
                  disabled={processing || balance < purchase.cost}
                  className="p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="text-4xl mb-2">{purchase.icon}</div>
                  <div className="text-white font-medium">{purchase.name}</div>
                  <div className="text-slate-400 text-sm">${purchase.cost.toFixed(2)}</div>
                  <div className="text-purple-400 text-xs mt-1 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" />
                    Earn {purchase.cost * 10} pts
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-400">
                <strong>Tip:</strong> Try clicking the purchase button multiple times rapidly. The system processes requests asynchronously - can you find a way to duplicate your points?
              </p>
            </div>
          </div>
        )}

        {/* Rewards View */}
        {view === 'rewards' && (
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Redeem Rewards</h4>
            <div className="space-y-3 mb-6">
              {REWARDS.map(reward => (
                <button
                  key={reward.id}
                  onClick={() => redeemReward(reward)}
                  disabled={processing || points < reward.points}
                  className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center gap-4"
                >
                  <div className="text-4xl">{reward.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{reward.name}</div>
                    <div className="text-slate-400 text-sm">{reward.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {reward.points}
                    </div>
                    <div className="text-xs text-slate-500">points</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-sm text-purple-400">
                <strong>Challenge:</strong> Accumulate 1000+ points by exploiting the race condition vulnerability to get the flag!
              </p>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3 text-sm">Recent Activity</h4>
            <div className="space-y-2">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-xs"
                >
                  {transaction}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
