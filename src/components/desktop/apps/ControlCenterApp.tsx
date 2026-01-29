import { useState } from 'react';
import { Sun, Volume2, Moon, Bell, Bluetooth, Wifi, Battery, Monitor } from 'lucide-react';

export const ControlCenterApp = () => {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(50);
  const [nightMode, setNightMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [wifi, setWifi] = useState(true);

  const ToggleButton = ({
    icon: Icon,
    label,
    active,
    onClick
  }: {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition-all ${
        active
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-6 h-6 mx-auto mb-2" />
      <div className="text-xs font-medium">{label}</div>
    </button>
  );

  const Slider = ({
    icon: Icon,
    label,
    value,
    onChange
  }: {
    icon: any;
    label: string;
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">{label}</span>
        <span className="ml-auto text-sm text-gray-500">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Monitor className="w-6 h-6" />
        Control Center
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <ToggleButton
            icon={wifi ? Wifi : Wifi}
            label="Wi-Fi"
            active={wifi}
            onClick={() => setWifi(!wifi)}
          />
          <ToggleButton
            icon={Bluetooth}
            label="Bluetooth"
            active={bluetooth}
            onClick={() => setBluetooth(!bluetooth)}
          />
          <ToggleButton
            icon={nightMode ? Moon : Sun}
            label={nightMode ? 'Night' : 'Day'}
            active={nightMode}
            onClick={() => setNightMode(!nightMode)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ToggleButton
            icon={Bell}
            label="Notifications"
            active={notifications}
            onClick={() => setNotifications(!notifications)}
          />
          <ToggleButton
            icon={Battery}
            label="Power Save"
            active={false}
            onClick={() => {}}
          />
        </div>

        <div className="space-y-3 mt-6">
          <Slider
            icon={Sun}
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
          />
          <Slider
            icon={Volume2}
            label="Volume"
            value={volume}
            onChange={setVolume}
          />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Display</span>
              <span className="text-gray-800 font-medium">1920x1080</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network</span>
              <span className="text-gray-800 font-medium">{wifi ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Battery</span>
              <span className="text-gray-800 font-medium">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System</span>
              <span className="text-gray-800 font-medium">NexusCipherOS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
