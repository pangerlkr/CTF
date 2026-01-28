import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, AlertCircle, CheckCircle, Smile } from 'lucide-react';

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
      author: 'jessie_norman',
      content: 'Amazing shot! 😍',
      timestamp: '2h'
    },
    {
      id: 2,
      author: 'panger__lkr',
      content: 'Love the composition!',
      timestamp: '1h'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(1234);
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
      author: 'current_user',
      content: newComment,
      timestamp: 'Just now'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg max-w-[500px] mx-auto shadow-sm">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/nexuscipherguard.india"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-0.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </a>
          <div>
            <a
              href="https://instagram.com/nexuscipherguard.india"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-900 hover:opacity-70 transition-opacity"
            >
              nexuscipherguard.india
            </a>
            <p className="text-xs text-gray-500">Nagaland, India</p>
          </div>
        </div>
        <button className="text-gray-900 hover:text-gray-600">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 aspect-square flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Web Security Tips</h3>
          <p className="text-gray-600 text-sm">Always validate user input!</p>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="hover:opacity-70 transition-opacity"
            >
              <Heart
                className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`}
              />
            </button>
            <button
              onClick={() => setShowCommentInput(!showCommentInput)}
              className="hover:opacity-70 transition-opacity"
            >
              <MessageCircle className="w-7 h-7 text-gray-900" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <Send className="w-7 h-7 text-gray-900" />
            </button>
          </div>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="hover:opacity-70 transition-opacity"
          >
            <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-gray-900' : ''} text-gray-900`} />
          </button>
        </div>

        <p className="text-sm font-semibold text-gray-900 mb-1">
          {likesCount.toLocaleString()} likes
        </p>

        <div className="text-sm mb-2">
          <a
            href="https://instagram.com/nexuscipherguard.india"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:opacity-70 transition-opacity"
          >
            nexuscipherguard.india
          </a>{' '}
          <span className="text-gray-900">Check out my latest post on web security! Comments are open 🔓</span>
        </div>

        {comments.length > 0 && (
          <div className="mb-2">
            <button
              onClick={() => setShowCommentInput(!showCommentInput)}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              View all {comments.length} comments
            </button>
          </div>
        )}

        {showCommentInput && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
              {comments.map((comment) => {
                const avatarSrc = comment.author === 'alice_wonder' ? '/jessica_norman.jpeg' :
                                 comment.author === 'photo_enthusiast' ? '/panger_lkr.jpeg' :
                                 '/logo.png';
                return (
                  <div key={comment.id} className="flex items-start gap-2">
                    <a
                      href="https://instagram.com/nexuscipherguard.india"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full flex-shrink-0 hover:opacity-80 transition-opacity overflow-hidden"
                    >
                      <img src={avatarSrc} alt={comment.author} className="w-full h-full object-cover" />
                    </a>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <a
                          href="https://instagram.com/nexuscipherguard.india"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-gray-900 hover:opacity-70 transition-opacity"
                        >
                          {comment.author}
                        </a>{' '}
                        <span className="text-gray-900 break-words">{comment.content}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        <button className="text-xs text-gray-500 font-semibold hover:text-gray-700">Like</button>
                        <button className="text-xs text-gray-500 font-semibold hover:text-gray-700">Reply</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {message && (
              <div className={`p-3 rounded-lg flex items-start gap-2 mb-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-xs ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <button type="button" className="text-gray-400 hover:text-gray-600">
                <Smile className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                placeholder="Add a comment..."
                required
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`text-sm font-semibold ${
                  newComment.trim()
                    ? 'text-blue-500 hover:text-blue-700'
                    : 'text-blue-300 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </form>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">2 HOURS AGO</p>
      </div>

      <div className="px-3 pb-3 space-y-2">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs mb-1">
            <strong>Challenge Hint:</strong> This comment section doesn't sanitize HTML tags.
          </p>
          <p className="text-yellow-700 text-xs">
            Click the comment button and try injecting a &lt;script&gt; tag or an &lt;img&gt; tag with an onerror event handler.
          </p>
        </div>

        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs">
            <strong>Note:</strong> For safety, actual JavaScript execution is prevented in this simulator. The flag is awarded when XSS patterns are detected.
          </p>
        </div>
      </div>
    </div>
  );
};
