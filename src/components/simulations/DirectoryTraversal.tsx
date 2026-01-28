import { useState } from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

const files: Record<string, string> = {
  'profile.txt': 'User: JohnDoe\nEmail: john@example.com\nRole: User',
  'settings.txt': 'Theme: Dark\nLanguage: English\nNotifications: Enabled',
  'invoice.pdf': '[PDF Binary Data - Invoice #12345]',
  '../config.txt': 'Database: production_db\nAPI_URL: https://api.example.com',
  '../admin/notes.txt': 'Admin Notes:\n- Server password: admin123\n- Flag: NCG{path_traversal_reads_sensitive_files}\n- Remember to secure the file download endpoint!',
  '../../etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000:admin:/home/admin:/bin/bash',
};

export const DirectoryTraversal = () => {
  const [filename, setFilename] = useState('profile.txt');
  const [fileContent, setFileContent] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownload = () => {
    setMessage(null);
    setFileContent('');

    if (files[filename]) {
      setFileContent(files[filename]);

      if (filename.includes('..') || filename.includes('admin') || filename.includes('etc')) {
        setMessage({
          type: 'success',
          text: `Path traversal successful! You accessed a restricted file: ${filename}`
        });
      } else {
        setMessage({
          type: 'error',
          text: 'File downloaded successfully. This is an authorized file.'
        });
      }
    } else {
      setMessage({
        type: 'error',
        text: 'File not found. Try different paths with ../ to traverse directories.'
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">File Download Portal</h3>
        <p className="text-slate-400 text-sm">Download your user files securely</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
        <h5 className="text-sm font-bold text-white mb-3">Available Files:</h5>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            profile.txt
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            settings.txt
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            invoice.pdf
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Enter filename to download
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
            placeholder="profile.txt"
          />
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Download File
        </button>

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

        {fileContent && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h5 className="text-sm font-bold text-white mb-2">File Contents:</h5>
            <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {fileContent}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs mb-2">
          <strong>Hint:</strong> The file download endpoint doesn't properly sanitize paths.
        </p>
        <p className="text-yellow-400 text-xs">
          Try using ../ to traverse to parent directories. Look for config files or admin directories!
        </p>
      </div>

      <div className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-xs">
          <strong>Try these paths:</strong> ../config.txt, ../admin/notes.txt, ../../etc/passwd
        </p>
      </div>
    </div>
  );
};
