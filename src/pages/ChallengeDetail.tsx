import { useState, useEffect } from 'react';
import { Shield, Flag, Download, ExternalLink, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from '../hooks/useNavigate';
import { supabase, Challenge } from '../lib/supabase';
import { PriceManipulation } from '../components/simulations/PriceManipulation';
import { SqlInjection } from '../components/simulations/SqlInjection';
import { SqlInjectionDump } from '../components/simulations/SqlInjectionDump';
import { IdorChallenge } from '../components/simulations/IdorChallenge';
import { XssChallenge } from '../components/simulations/XssChallenge';
import { JwtChallenge } from '../components/simulations/JwtChallenge';
import { OtpBruteForce } from '../components/simulations/OtpBruteForce';
import { PaymentBypass } from '../components/simulations/Paymentbypass';
import { UnlimitedCashback } from '../components/simulations/UnlimitedCashback';
import { DirectoryTraversal } from '../components/simulations/DirectoryTraversal';
import { HardcodedApiKeys } from '../components/simulations/HardcodedApiKeys';
import { FileUploadBypass } from '../components/simulations/FileUploadBypass';
import { OpenRedirect } from '../components/simulations/OpenRedirect';
import { GraphqlIntrospection } from '../components/simulations/GraphqlIntrospection';
import { ApiRateLimit } from '../components/simulations/ApiRateLimit';
import { SsrfChallenge } from '../components/simulations/SsrfChallenge';
import { CouponStacking } from '../components/simulations/CouponStacking';
import { RaceConditionPoints } from '../components/simulations/RaceConditionPoints';
import { SessionFixation } from '../components/simulations/SessionFixation';
import { HiddenAdminPanel } from '../components/simulations/HiddenAdminPanel';

export const ChallengeDetail = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const slug = pathname.split('/').pop();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchChallenge = async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setChallenge(data);

      const { data: solveData } = await supabase
        .from('solves')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', data.id)
        .maybeSingle();

      setIsSolved(!!solveData);
      setLoading(false);
    };

    fetchChallenge();
  }, [user, slug, navigate]);

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !user) return;

    setSubmitting(true);
    setMessage(null);

    const recentAttemptsResult = await supabase
      .from('flag_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge.id)
      .gte('attempted_at', new Date(Date.now() - 60000).toISOString());

    if (recentAttemptsResult.data && recentAttemptsResult.data.length >= 5) {
      setMessage({ type: 'error', text: 'Too many attempts. Please wait a minute.' });
      setSubmitting(false);
      return;
    }

    await supabase.from('flag_attempts').insert({
      user_id: user.id,
      challenge_id: challenge.id,
    });

    if (flagInput.trim() === challenge.flag.trim()) {
      const { error } = await supabase.from('solves').insert({
        user_id: user.id,
        challenge_id: challenge.id,
      });

      if (!error) {
        setMessage({ type: 'success', text: `Correct! You earned ${challenge.points} points!` });
        setIsSolved(true);
        setFlagInput('');
        await refreshProfile();
      } else {
        setMessage({ type: 'error', text: 'Already solved!' });
      }
    } else {
      setMessage({ type: 'error', text: 'Incorrect flag. Try again!' });
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge not found</h2>
          <button
            onClick={() => navigate('/challenges')}
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Back to challenges
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      case 'hard': return 'text-red-400 border-red-500/20 bg-red-500/10';
      default: return 'text-slate-400';
    }
  };

  const renderSimulator = () => {
    switch (slug) {
      case 'order-price-manipulation':
        return <PriceManipulation />;
      case 'sql-injection-login':
        return <SqlInjection />;
      case 'sql-injection-dump':
        return <SqlInjectionDump />;
      case 'idor-bank-balance':
        return <IdorChallenge />;
      case 'stored-xss-comments':
        return <XssChallenge />;
      case 'jwt-alg-none':
        return <JwtChallenge />;
      case 'otp-brute-force':
        return <OtpBruteForce />;
      case 'unauthorized-payment-bypass':
        return <PaymentBypass />;
      case 'unlimited-cashback':
        return <UnlimitedCashback />;
      case 'directory-traversal':
        return <DirectoryTraversal />;
      case 'hardcoded-api-keys':
        return <HardcodedApiKeys />;
      case 'file-upload-bypass':
        return <FileUploadBypass />;
      case 'open-redirect':
        return <OpenRedirect />;
      case 'graphql-introspection':
        return <GraphqlIntrospection />;
      case 'api-rate-limit-bypass':
        return <ApiRateLimit />;
      case 'ssrf-admin-panel':
        return <SsrfChallenge />;
      case 'coupon-stacking':
        return <CouponStacking />;
      case 'race-condition-points':
        return <RaceConditionPoints />;
      case 'session-fixation':
        return <SessionFixation />;
      case 'hidden-admin-css':
        return <HiddenAdminPanel />;
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
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3"
            >
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                NEXUSCIPHERGUARD
              </span>
            </button>
            <button
              onClick={() => navigate('/challenges')}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ← Back to challenges
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium">
                  {challenge.category}
                </span>
                <span className={`text-xs px-3 py-1 rounded border font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{challenge.title}</h1>
            </div>
            {isSolved && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Solved</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <span className="text-white text-lg font-bold">{challenge.points} points</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          {renderSimulator() && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Interactive Challenge</h2>
              {renderSimulator()}
            </div>
          )}

          {(challenge.file_url || challenge.sandbox_url) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Resources</h2>
              <div className="space-y-3">
                {challenge.file_url && (
                  <a
                    href={challenge.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors"
                  >
                    <Download className="w-5 h-5 text-cyan-400" />
                    <span className="text-white">Download Challenge Files</span>
                  </a>
                )}
                {challenge.sandbox_url && (
                  <a
                    href={challenge.sandbox_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-cyan-400" />
                    <span className="text-white">Open Sandbox Environment</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Submit Flag</h2>
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
                <p className={`${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              </div>
            )}
            {!isSolved ? (
              <form onSubmit={handleSubmitFlag} className="space-y-4">
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    placeholder="NCG{...}"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-mono"
                    required
                    disabled={submitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Checking...' : 'Submit Flag'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 text-emerald-400">
                You've already solved this challenge!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
