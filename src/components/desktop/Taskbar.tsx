import { useState } from 'react';
import { Square } from 'lucide-react';
import { useWindows } from '../../contexts/WindowContext';
import { StartMenu } from './StartMenu';

export const Taskbar = () => {
  const { windows, restoreWindow, focusWindow } = useWindows();
  const [showStartMenu, setShowStartMenu] = useState(false);

  const visibleWindows = windows.filter(w => !w.isMinimized);

  return (
    <>
      {showStartMenu && <StartMenu onClose={() => setShowStartMenu(false)} />}

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-600 to-blue-500 border-t-2 border-blue-700 flex items-center px-2 gap-2 shadow-2xl z-50">
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className={`px-4 py-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-sm shadow-md flex items-center gap-2 transition-colors ${
            showStartMenu ? 'bg-green-700' : ''
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
          <span>Start</span>
        </button>

        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {windows.map(window => (
            <button
              key={window.id}
              onClick={() => {
                if (window.isMinimized) {
                  restoreWindow(window.id);
                } else {
                  focusWindow(window.id);
                }
              }}
              className={`px-3 py-1 text-white text-sm rounded flex items-center gap-2 min-w-32 max-w-48 truncate ${
                !window.isMinimized && visibleWindows.find(w => w.id === window.id && w.zIndex === Math.max(...visibleWindows.map(w => w.zIndex)))
                  ? 'bg-blue-400'
                  : 'bg-blue-500 hover:bg-blue-400'
              }`}
            >
              {window.icon}
              <span className="truncate">{window.title}</span>
            </button>
          ))}
        </div>

        <div className="text-white text-sm px-3 py-1 bg-blue-700 rounded">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </>
  );
};
