import { useRef, useEffect, useState } from 'react';
import { X, Minimize2, Square, Maximize2 } from 'lucide-react';
import { useWindows, WindowState } from '../../contexts/WindowContext';

interface WindowProps {
  window: WindowState;
}

export const Window = ({ window }: WindowProps) => {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition, updateWindowSize } = useWindows();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!window.isMaximized) {
        updateWindowPosition(
          window.id,
          e.clientX - dragOffset.x,
          e.clientY - dragOffset.y
        );
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, window.isMaximized, updateWindowPosition]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!window.isMaximized) {
        const newWidth = Math.max(300, e.clientX - window.x);
        const newHeight = Math.max(200, e.clientY - window.y);
        updateWindowSize(window.id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, window.id, window.x, window.y, window.isMaximized, updateWindowSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    focusWindow(window.id);
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  if (window.isMinimized) return null;

  const style: React.CSSProperties = window.isMaximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 48px)' }
    : { left: window.x, top: window.y, width: window.width, height: window.height };

  return (
    <div
      ref={windowRef}
      className="absolute bg-white border-2 border-t-4 border-blue-500 rounded-sm shadow-2xl flex flex-col"
      style={{ ...style, zIndex: window.zIndex }}
      onMouseDown={() => focusWindow(window.id)}
    >
      <div
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 flex items-center justify-between cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          {window.icon}
          <span>{window.title}</span>
        </div>
        <div className="window-controls flex items-center gap-1">
          <button
            onClick={() => minimizeWindow(window.id)}
            className="w-6 h-6 flex items-center justify-center hover:bg-blue-400 rounded"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => window.isMaximized ? restoreWindow(window.id) : maximizeWindow(window.id)}
            className="w-6 h-6 flex items-center justify-center hover:bg-blue-400 rounded"
          >
            {window.isMaximized ? <Square className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={() => closeWindow(window.id)}
            className="w-6 h-6 flex items-center justify-center hover:bg-red-500 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {window.content}
      </div>

      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};
