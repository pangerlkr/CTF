import { useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

type Comment = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

export const XssChallenge = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Alice',
      content: 'Great article! Very informative.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'Bob',
      content: 'Thanks for sharing this.',
      timestamp: '1 hour ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('Guest');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const xssPatterns = [
      '<script>',
      'javascript:',
      'onerror=',
      'onload=',
      '<img',
      '<svg',
      'alert(',
    ];

    const containsXss = xssPatterns.some(pattern =>
      newComment.toLowerCase().includes(pattern.toLowerCase())
    );

    if (containsXss) {
      setMessage({
        type: 'success',
        text: `XSS vulnerability detected! Your payload would execute in a real scenario. Flag: NCG{xss_stored_successfully}`
      });
    }

    const comment: Comment = {
      id: comments.length + 1,
      author: author || 'Guest',
      content: newComment,
      timestamp: 'Just now'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">Blog Comment Section</h3>
        <p className="text-slate-400 text-sm">Post a comment below (input is not sanitized)</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          Comments ({comments.length})
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-900 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-400 font-medium text-sm">{comment.author}</span>
                <span className="text-slate-500 text-xs">{comment.timestamp}</span>
              </div>
              <p className="text-slate-300 text-sm break-words">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Comment</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
            placeholder="Write your comment..."
            required
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
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

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Post Comment
        </button>
      </form>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs mb-2">
          <strong>Hint:</strong> This comment section doesn't sanitize HTML tags.
        </p>
        <p className="text-yellow-400 text-xs">
          Try injecting a &lt;script&gt; tag or an &lt;img&gt; tag with an onerror event handler.
        </p>
      </div>

      <div className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-xs">
          <strong>Note:</strong> For safety, actual JavaScript execution is prevented in this simulator.
          The flag is awarded when XSS patterns are detected.
        </p>
      </div>
    </div>
  );
};
