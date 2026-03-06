import { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Minus, Maximize2, Square } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  isActive: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
}

const Window = ({
  id,
  title,
  icon,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
  isActive,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
}: WindowProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size });
  const [isAnimating, setIsAnimating] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (isMaximized) return;
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    setIsResizing(true);
    setResizeDir(direction);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width));
        const newY = Math.max(28, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100));
        setPosition({ x: newX, y: newY });
      }
      if (isResizing && windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();

        if (resizeDir.includes('e')) {
          const newWidth = Math.max(minSize.width, e.clientX - rect.left);
          setSize(prev => ({ ...prev, width: newWidth }));
        }
        if (resizeDir.includes('s')) {
          const newHeight = Math.max(minSize.height, e.clientY - rect.top);
          setSize(prev => ({ ...prev, height: newHeight }));
        }
        if (resizeDir.includes('w')) {
          const newWidth = Math.max(minSize.width, rect.right - e.clientX);
          const newX = Math.min(e.clientX, rect.right - minSize.width);
          setSize(prev => ({ ...prev, width: newWidth }));
          setPosition(prev => ({ ...prev, x: newX }));
        }
        if (resizeDir.includes('n')) {
          const newHeight = Math.max(minSize.height, rect.bottom - e.clientY);
          const newY = Math.min(e.clientY, rect.bottom - minSize.height);
          setSize(prev => ({ ...prev, height: newHeight }));
          setPosition(prev => ({ ...prev, y: Math.max(28, newY) }));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDir('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : isResizing ? `${resizeDir}-resize` : 'default';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, dragOffset, minSize, resizeDir, size.width]);

  const handleMaximize = () => {
    if (isMaximized) {
      setPosition(preMaximizeState.position);
      setSize(preMaximizeState.size);
    } else {
      setPreMaximizeState({ position, size });
      setPosition({ x: 0, y: 28 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 28 - 60 });
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col overflow-hidden ${
        isAnimating ? 'animate-window-open' : isClosing ? 'animate-window-close' : ''
      }`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 28 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 88px)' : size.height,
        zIndex,
        borderRadius: isMaximized ? 0 : '10px',
        boxShadow: isActive
          ? '0 0 0 1px rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 60px -20px rgba(0,0,0,0.4)'
          : '0 0 0 1px rgba(255,255,255,0.05), 0 10px 30px -10px rgba(0,0,0,0.4)',
        transition: isMaximized !== undefined ? 'none' : undefined,
      }}
      onClick={onFocus}
    >
      {/* Window background */}
      <div
        className="absolute inset-0 backdrop-blur-2xl"
        style={{
          background: isActive
            ? 'linear-gradient(180deg, rgba(50,50,50,0.98) 0%, rgba(35,35,35,0.98) 100%)'
            : 'linear-gradient(180deg, rgba(45,45,45,0.95) 0%, rgba(30,30,30,0.95) 100%)',
          borderRadius: 'inherit'
        }}
      />

      {/* Title Bar */}
      <div
        className={`relative flex items-center h-11 px-3 cursor-grab active:cursor-grabbing select-none ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: isActive ? 'rgba(255,255,255,0.02)' : 'transparent'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximize}
      >
        {/* Traffic Light Buttons */}
        <div className="flex items-center gap-2 mr-4 traffic-lights">
          <button
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            onMouseDown={e => e.stopPropagation()}
            className="traffic-btn w-3 h-3 rounded-full flex items-center justify-center"
            style={{ background: isActive ? '#ff5f57' : '#4a4a4a' }}
          >
            <X className="traffic-icon w-2 h-2 text-black/60" strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            onMouseDown={e => e.stopPropagation()}
            className="traffic-btn w-3 h-3 rounded-full flex items-center justify-center"
            style={{ background: isActive ? '#febc2e' : '#4a4a4a' }}
          >
            <Minus className="traffic-icon w-2 h-2 text-black/60" strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
            onMouseDown={e => e.stopPropagation()}
            className="traffic-btn w-3 h-3 rounded-full flex items-center justify-center"
            style={{ background: isActive ? '#28c840' : '#4a4a4a' }}
          >
            {isMaximized ? (
              <Square className="traffic-icon w-1.5 h-1.5 text-black/60" strokeWidth={2.5} />
            ) : (
              <Maximize2 className="traffic-icon w-1.5 h-1.5 text-black/60" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Title */}
        <div className="flex-1 flex items-center justify-center gap-2 -ml-16">
          {icon && <span className="text-white/50 scale-90">{icon}</span>}
          <span className={`text-[13px] font-medium truncate ${isActive ? 'text-white/90' : 'text-white/50'}`}>
            {title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ borderRadius: isMaximized ? 0 : '0 0 10px 10px' }}
      >
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className="absolute top-3 left-0 bottom-3 w-1 cursor-w-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className="absolute top-3 right-0 bottom-3 w-1 cursor-e-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />

          {/* Corners */}
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group" onMouseDown={(e) => handleResizeMouseDown(e, 'se')}>
            <svg className="absolute bottom-1 right-1 w-2 h-2 text-white/20 group-hover:text-white/40" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="6" cy="6" r="1.2" />
              <circle cx="2.5" cy="6" r="1.2" />
              <circle cx="6" cy="2.5" r="1.2" />
            </svg>
          </div>
        </>
      )}

      <style>{`
        @keyframes window-open {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes window-close {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        .animate-window-open {
          animation: window-open 0.15s ease-out forwards;
        }
        .animate-window-close {
          animation: window-close 0.15s ease-in forwards;
          pointer-events: none;
        }
        /* Traffic light buttons */
        .traffic-lights .traffic-icon {
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .traffic-lights:hover .traffic-icon {
          opacity: 1;
        }
        .traffic-btn {
          transition: transform 0.1s ease, filter 0.1s ease;
        }
        .traffic-btn:hover {
          filter: brightness(0.9);
        }
        .traffic-btn:active {
          transform: scale(0.9);
        }
      `}</style>
    </div>
  );
};

export default Window;
