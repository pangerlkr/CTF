import { ReactNode, useRef, useState, useEffect } from 'react';

interface DesktopIconProps {
  icon: ReactNode;
  label: string;
  onDoubleClick: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export const DesktopIcon = ({ icon, label, onDoubleClick, position, onPositionChange }: DesktopIconProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.detail === 2) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: position.x,
      offsetY: position.y,
    };
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const newX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.offsetX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, dragRef.current.offsetY + deltaY));

      onPositionChange({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onPositionChange]);

  return (
    <div
      className={`flex flex-col items-center gap-1 p-2 cursor-pointer hover:bg-blue-100/30 rounded select-none w-24 absolute ${
        isDragging ? 'opacity-70' : ''
      }`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onDoubleClick={onDoubleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="w-12 h-12 flex items-center justify-center text-white drop-shadow-lg pointer-events-none">
        {icon}
      </div>
      <span className="text-xs text-white text-center drop-shadow-md font-medium px-1 bg-blue-600/40 rounded pointer-events-none">
        {label}
      </span>
    </div>
  );
};
