import { useState, useEffect } from 'react';
import { Square, Settings, Sun, Volume2, Wifi, Bell } from 'lucide-react';
import { useWindows } from '../../contexts/WindowContext';
import { StartMenu } from './StartMenu';

export const Taskbar = () => {
  const { windows, restoreWindow, focusWindow } = useWindows();
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(50);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const overlay = document.getElementById('brightness-overlay');
    if (overlay) {
      overlay.style.opacity = String((100 - brightness) / 100);
    }
  }, [brightness]);

  useEffect(() => {
    if (showVolumeIndicator) {
      const timer = setTimeout(() => setShowVolumeIndicator(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showVolumeIndicator]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setShowVolumeIndicator(true);
  };

  const handleWifiToggle = () => {
    setWifiEnabled(!wifiEnabled);
    setNotification(`Wi-Fi ${!wifiEnabled ? 'Connected' : 'Disconnected'}`);
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setNotification(`Notifications ${!notificationsEnabled ? 'Enabled' : 'Disabled'}`);
  };

  const visibleWindows = windows.filter(w => !w.isMinimized);

  return (
    <>
      <div
        id="brightness-overlay"
        className="fixed inset-0 bg-black pointer-events-none z-30 transition-opacity duration-200"
        style={{ opacity: (100 - brightness) / 100 }}
      />

      {showVolumeIndicator && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50 flex items-center gap-3 animate-fade-in">
          <Volume2 className="w-5 h-5 text-blue-500" />
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-150"
                style={{ width: `${volume}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 w-10">{volume}%</span>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-2xl px-4 py-2 z-50 text-sm animate-fade-in">
          {notification}
        </div>
      )}

      {showStartMenu && <StartMenu onClose={() => setShowStartMenu(false)} />}

      {showControlCenter && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowControlCenter(false)}
          />
          <div className="fixed bottom-14 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h3 className="font-semibold">Control Center</h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleWifiToggle}
                  className={`p-3 rounded-lg transition-all active:scale-95 ${
                    wifiEnabled
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Wifi className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-medium">Wi-Fi</div>
                  <div className="text-xs opacity-75">{wifiEnabled ? 'On' : 'Off'}</div>
                </button>

                <button
                  onClick={handleNotificationToggle}
                  className={`p-3 rounded-lg transition-all active:scale-95 ${
                    notificationsEnabled
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bell className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-medium">Notifications</div>
                  <div className="text-xs opacity-75">{notificationsEnabled ? 'On' : 'Off'}</div>
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Brightness</span>
                    <span className="ml-auto text-xs text-gray-500">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${brightness}%, rgb(229 231 235) ${brightness}%, rgb(229 231 235) 100%)`
                    }}
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Volume</span>
                    <span className="ml-auto text-xs text-gray-500">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${volume}%, rgb(229 231 235) ${volume}%, rgb(229 231 235) 100%)`
                    }}
                  />
                </div>
              </div>

              <div className="border-t pt-3 text-xs text-gray-500">
                <div className="flex justify-between mb-1">
                  <span>Display</span>
                  <span className="text-gray-700">1920x1080</span>
                </div>
                <div className="flex justify-between">
                  <span>Network</span>
                  <span className="text-gray-700">{wifiEnabled ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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

        <button
          onClick={() => setShowControlCenter(!showControlCenter)}
          className={`p-2 text-white rounded hover:bg-blue-400 transition-colors ${
            showControlCenter ? 'bg-blue-400' : ''
          }`}
          title="Control Center"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="text-white text-sm px-3 py-1 bg-blue-700 rounded">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </>
  );
};
