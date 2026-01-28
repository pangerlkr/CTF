import { ReactNode } from 'react';

interface DesktopIconProps {
  icon: ReactNode;
  label: string;
  onDoubleClick: () => void;
}

export const DesktopIcon = ({ icon, label, onDoubleClick }: DesktopIconProps) => {
  return (
    <div
      className="flex flex-col items-center gap-1 p-2 cursor-pointer hover:bg-blue-100/30 rounded select-none w-24"
      onDoubleClick={onDoubleClick}
    >
      <div className="w-12 h-12 flex items-center justify-center text-white drop-shadow-lg">
        {icon}
      </div>
      <span className="text-xs text-white text-center drop-shadow-md font-medium px-1 bg-blue-600/40 rounded">
        {label}
      </span>
    </div>
  );
};
