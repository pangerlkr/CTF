import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Code } from 'lucide-react';

export const HiddenAdminPanel = () => {
  const [showInspectorHint, setShowInspectorHint] = useState(false);
  const [adminPanelRevealed, setAdminPanelRevealed] = useState(false);

  const revealAdminPanel = () => {
    setAdminPanelRevealed(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
        <h1 className="text-4xl font-bold mb-4">TechCorp Solutions</h1>
        <p className="text-blue-100 text-lg">Your Trusted Business Partner</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-gray-600 text-sm">Enterprise-grade security for your data</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600 text-sm">Your data is protected and encrypted</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent</h3>
            <p className="text-gray-600 text-sm">Open about our practices and policies</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Our Platform</h2>
          <p className="text-gray-700 mb-4">
            We provide cutting-edge solutions for modern businesses. Our platform is built with
            security and scalability in mind.
          </p>
          <button
            onClick={() => setShowInspectorHint(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Learn More
          </button>
        </div>

        {showInspectorHint && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Developer Tip</h3>
                <p className="text-gray-700 mb-2">
                  Sometimes web developers hide elements using CSS but forget to remove them from the DOM.
                  Try inspecting this page's HTML structure...
                </p>
                <p className="text-sm text-gray-600 italic">
                  Hint: Right-click anywhere on the page and select "Inspect Element" or press F12 to open your browser's developer tools.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="hidden" id="admin-panel-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 border-4 border-red-500 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-white flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">🔓 Admin Panel Access</h2>
                <p className="text-red-100 mb-4">
                  You discovered the hidden admin panel! This element was set to
                  <code className="mx-1 px-2 py-1 bg-red-900/50 rounded text-red-100 font-mono text-sm">display: none</code>
                  in CSS, making it invisible but still present in the DOM.
                </p>
                <div className="bg-red-900/30 rounded-lg p-4 mb-4">
                  <p className="text-red-50 font-mono text-sm">Flag: NCG{hidden_in_plain_sight_css}</p>
                </div>
                <p className="text-red-100 text-sm">
                  <strong>Vulnerability:</strong> Sensitive UI elements should never be hidden with CSS alone.
                  They should be completely removed from the DOM or protected with proper server-side authorization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {adminPanelRevealed && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 border-4 border-red-500 rounded-lg p-6 mb-8 animate-fade-in">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-white flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">🔓 Admin Panel Access</h2>
                <p className="text-red-100 mb-4">
                  You discovered the hidden admin panel! This element was set to
                  <code className="mx-1 px-2 py-1 bg-red-900/50 rounded text-red-100 font-mono text-sm">display: none</code>
                  in CSS, making it invisible but still present in the DOM.
                </p>
                <div className="bg-red-900/30 rounded-lg p-4 mb-4">
                  <p className="text-red-50 font-mono text-sm">Flag: NCG{'{'}hidden_in_plain_sight_css{'}'}</p>
                </div>
                <p className="text-red-100 text-sm">
                  <strong>Vulnerability:</strong> Sensitive UI elements should never be hidden with CSS alone.
                  They should be completely removed from the DOM or protected with proper server-side authorization.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Instructions</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <p>Open your browser's Developer Tools (F12 or right-click → Inspect)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <p>Look through the HTML structure in the Elements/Inspector tab</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <p>Find the hidden admin panel element (hint: look for elements with <code className="px-1 bg-gray-200 rounded text-sm font-mono">display: none</code> or <code className="px-1 bg-gray-200 rounded text-sm font-mono">hidden</code> class)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <p>Either remove the CSS hiding it, or use this button to reveal it:</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={revealAdminPanel}
              disabled={adminPanelRevealed}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                adminPanelRevealed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg'
              }`}
            >
              {adminPanelRevealed ? (
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Admin Panel Revealed
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5" />
                  Reveal Hidden Admin Panel
                </span>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              In a real scenario, you would modify the CSS directly in DevTools
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 px-8 py-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>© 2024 TechCorp Solutions. All rights reserved.</p>
          <p>Built with security in mind</p>
        </div>
      </div>
    </div>
  );
};
