import { useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Folder, Terminal as TerminalIcon, FileText, User, Settings, Code2, Briefcase, Globe, Mail, Github, Linkedin, Monitor, Camera, Mic, StickyNote, Gamepad2, Trash2, Grid3X3, X, Calculator as CalcIcon, CloudSun, Award } from 'lucide-react';
import Window from './Window';
import Taskbar from './Taskbar';
import FileManager from './apps/FileManager';
import Terminal from './apps/Terminal';
import TextViewer from './apps/TextViewer';
import CameraApp from './apps/Camera';
import Notepad from './apps/Notepad';
import Recorder from './apps/Recorder';
import Games from './apps/Games';
import Trash from './apps/Trash';
import Resume from './apps/Resume';
import Calculator from './apps/Calculator';
import Weather from './apps/Weather';
import Certificates from './apps/Certificates';
import { getItemAtPath } from './fileSystem';

interface WindowState {
  id: string;
  type: 'filemanager' | 'terminal' | 'textviewer' | 'camera' | 'notepad' | 'recorder' | 'games' | 'trash' | 'resume' | 'calculator' | 'weather' | 'certificates';
  title: string;
  icon: ReactNode;
  isMinimized: boolean;
  props?: Record<string, unknown>;
}

interface ContextMenu {
  x: number;
  y: number;
  items: { label: string; action: () => void; icon?: ReactNode; divider?: boolean }[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: ReactNode;
}

const DesktopEnvironment = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(300);
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({});
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [bootStage, setBootStage] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showAppsFolder, setShowAppsFolder] = useState(false);

  // Selection rectangle state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Boot sequence
  useEffect(() => {
    if (isBooting) {
      const stages = [
        { delay: 300, stage: 1 },
        { delay: 600, stage: 2 },
        { delay: 900, stage: 3 },
        { delay: 1400, stage: 4 },
      ];

      stages.forEach(({ delay, stage }) => {
        setTimeout(() => setBootStage(stage), delay);
      });

      setTimeout(() => {
        setIsBooting(false);
        // Show welcome notification
        setTimeout(() => {
          addNotification('Welcome!', 'Double-click icons to explore', <Monitor className="w-5 h-5" />);
        }, 500);
      }, 1800);
    }
  }, [isBooting]);

  const addNotification = (title: string, message: string, icon: ReactNode) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, title, message, icon }]);
    setShowNotification(true);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setShowNotification(false);
    }, 4000);
  };

  const generateId = () => `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const openWindow = useCallback((type: WindowState['type'], title: string, icon: ReactNode, props?: Record<string, unknown>) => {
    const id = generateId();
    const newWindow: WindowState = {
      id,
      type,
      title,
      icon,
      isMinimized: false,
      props,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
    setWindowZIndices(prev => ({ ...prev, [id]: nextZIndex }));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  }, [activeWindowId, windows]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    setActiveWindowId(id);
    setWindowZIndices(prev => ({ ...prev, [id]: nextZIndex }));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const handleOpenFile = useCallback((path: string, content: string, name: string) => {
    openWindow('textviewer', name, <FileText className="w-4 h-4" />, { content, fileName: name });
  }, [openWindow]);

  const handleOpenApp = useCallback((app: string) => {
    switch (app) {
      case 'filemanager':
        openWindow('filemanager', 'Files', <Folder className="w-4 h-4" />);
        break;
      case 'terminal':
        openWindow('terminal', 'Terminal', <TerminalIcon className="w-4 h-4" />);
        break;
      case 'about':
        const aboutFile = getItemAtPath('/home/arsham/about.txt');
        if (aboutFile?.content) {
          openWindow('textviewer', 'About Me', <User className="w-4 h-4" />, {
            content: aboutFile.content,
            fileName: 'about.txt'
          });
        }
        break;
      case 'skills':
        openWindow('filemanager', 'Skills', <Folder className="w-4 h-4" />, {
          initialPath: '/home/arsham/skills'
        });
        break;
      case 'projects':
        openWindow('filemanager', 'Projects', <Folder className="w-4 h-4" />, {
          initialPath: '/home/arsham/projects'
        });
        break;
      case 'contact':
        const contactFile = getItemAtPath('/home/arsham/contact.txt');
        if (contactFile?.content) {
          openWindow('textviewer', 'Contact', <Mail className="w-4 h-4" />, {
            content: contactFile.content,
            fileName: 'contact.txt'
          });
        }
        break;
      case 'resume':
        openWindow('resume', 'Resume - Arsham.pdf', <Briefcase className="w-4 h-4" />);
        break;
      case 'github':
        window.open('https://github.com/Arsham1ho', '_blank');
        break;
      case 'linkedin':
        window.open('https://linkedin.com/in/arsham1ho', '_blank');
        break;
      case 'welcome':
        const welcomeFile = getItemAtPath('/home/arsham/welcome.txt');
        if (welcomeFile?.content) {
          openWindow('textviewer', 'Welcome', <FileText className="w-4 h-4" />, {
            content: welcomeFile.content,
            fileName: 'welcome.txt'
          });
        }
        break;
      case 'camera':
        openWindow('camera', 'Camera', <Camera className="w-4 h-4" />);
        break;
      case 'notepad':
        openWindow('notepad', 'Notepad', <StickyNote className="w-4 h-4" />);
        break;
      case 'recorder':
        openWindow('recorder', 'Voice Recorder', <Mic className="w-4 h-4" />);
        break;
      case 'games':
        openWindow('games', 'Games', <Gamepad2 className="w-4 h-4" />);
        break;
      case 'trash':
        openWindow('trash', 'Trash', <Trash2 className="w-4 h-4" />);
        break;
      case 'calculator':
        openWindow('calculator', 'Calculator', <CalcIcon className="w-4 h-4" />);
        break;
      case 'weather':
        openWindow('weather', 'Weather', <CloudSun className="w-4 h-4" />);
        break;
      case 'certificates':
        openWindow('certificates', 'Certificates', <Award className="w-4 h-4" />);
        break;
    }
    setContextMenu(null);
  }, [openWindow]);

  const handleDesktopIconDoubleClick = useCallback((type: string) => {
    if (type === 'apps') {
      setShowAppsFolder(true);
      setSelectedIcons([]);
      return;
    }
    handleOpenApp(type);
    setSelectedIcons([]);
  }, [handleOpenApp]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcons([]);
      setContextMenu(null);
    }
  };

  // Selection rectangle handlers
  const handleSelectionStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.button !== 0) return; // Only left click

    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
    setSelectedIcons([]);
    setContextMenu(null);
  };

  const handleSelectionMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return;

    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);

    setSelectionEnd({ x, y });

    // Calculate selection box bounds
    const selBox = {
      left: Math.min(selectionStart.x, x),
      right: Math.max(selectionStart.x, x),
      top: Math.min(selectionStart.y, y),
      bottom: Math.max(selectionStart.y, y),
    };

    // Check which icons are within the selection
    const selected: string[] = [];
    iconRefs.current.forEach((iconEl, iconId) => {
      if (!iconEl || !rect) return;
      const iconRect = iconEl.getBoundingClientRect();
      const iconBox = {
        left: iconRect.left - rect.left,
        right: iconRect.right - rect.left,
        top: iconRect.top - rect.top,
        bottom: iconRect.bottom - rect.top,
      };

      // Check intersection
      if (
        selBox.left < iconBox.right &&
        selBox.right > iconBox.left &&
        selBox.top < iconBox.bottom &&
        selBox.bottom > iconBox.top
      ) {
        selected.push(iconId);
      }
    });

    setSelectedIcons(selected);
  }, [isSelecting, selectionStart]);

  const handleSelectionEnd = () => {
    setIsSelecting(false);
  };

  // Mouse up listener for selection
  useEffect(() => {
    const handleMouseUp = () => setIsSelecting(false);
    if (isSelecting) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isSelecting]);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setContextMenu({
      x: Math.min(x, rect.width - 200),
      y: Math.min(y, rect.height - 250),
      items: [
        { label: 'Open Terminal', action: () => handleOpenApp('terminal'), icon: <TerminalIcon className="w-4 h-4" /> },
        { label: 'Open Files', action: () => handleOpenApp('filemanager'), icon: <Folder className="w-4 h-4" /> },
        { label: 'View About', action: () => handleOpenApp('about'), icon: <User className="w-4 h-4" /> },
        { label: '', action: () => {}, divider: true },
        { label: 'Change Wallpaper', action: () => addNotification('Info', 'Wallpaper settings coming soon!', <Settings className="w-4 h-4" />), icon: <Monitor className="w-4 h-4" /> },
        { label: 'Display Settings', action: () => addNotification('Info', 'Display settings coming soon!', <Settings className="w-4 h-4" />), icon: <Settings className="w-4 h-4" /> },
      ]
    });
  };

  const renderWindowContent = (window: WindowState) => {
    switch (window.type) {
      case 'filemanager':
        return (
          <FileManager
            onOpenFile={handleOpenFile}
            initialPath={(window.props?.initialPath as string) || '/home/arsham'}
          />
        );
      case 'terminal':
        return <Terminal onOpenFile={handleOpenFile} />;
      case 'textviewer':
        return (
          <TextViewer
            content={(window.props?.content as string) || ''}
            fileName={(window.props?.fileName as string) || 'Untitled'}
          />
        );
      case 'camera':
        return <CameraApp />;
      case 'notepad':
        return <Notepad />;
      case 'recorder':
        return <Recorder />;
      case 'games':
        return <Games />;
      case 'trash':
        return <Trash />;
      case 'resume':
        return <Resume />;
      case 'calculator':
        return <Calculator />;
      case 'weather':
        return <Weather />;
      case 'certificates':
        return <Certificates />;
      default:
        return null;
    }
  };

  const getWindowSize = (type: WindowState['type']) => {
    switch (type) {
      case 'terminal':
        return { width: 700, height: 440 };
      case 'filemanager':
        return { width: 780, height: 500 };
      case 'textviewer':
        return { width: 640, height: 480 };
      case 'camera':
        return { width: 640, height: 520 };
      case 'notepad':
        return { width: 700, height: 500 };
      case 'recorder':
        return { width: 480, height: 520 };
      case 'games':
        return { width: 520, height: 480 };
      case 'trash':
        return { width: 550, height: 450 };
      case 'resume':
        return { width: 750, height: 550 };
      case 'calculator':
        return { width: 300, height: 450 };
      case 'weather':
        return { width: 380, height: 580 };
      case 'certificates':
        return { width: 800, height: 550 };
      default:
        return { width: 600, height: 400 };
    }
  };

  const getWindowPosition = (index: number) => {
    const baseX = 140;
    const baseY = 70;
    const offset = 30;
    return {
      x: baseX + (index % 5) * offset,
      y: baseY + (index % 5) * offset,
    };
  };

  // Desktop icons with realistic styling
  const desktopIcons = [
    {
      id: 'filemanager',
      label: 'Files',
      icon: (
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl shadow-lg transform rotate-3" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-500 rounded-xl shadow-lg flex items-center justify-center">
            <Folder className="w-9 h-9 text-white drop-shadow-md" fill="white" fillOpacity={0.3} />
          </div>
        </div>
      )
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-b from-gray-800 to-black rounded-xl shadow-lg flex items-center justify-center border border-gray-700">
          <div className="text-green-400 font-mono text-lg font-bold">{'>'}_</div>
        </div>
      )
    },
    {
      id: 'about',
      label: 'About Me',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
          <User className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center">
          <Code2 className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg flex items-center justify-center">
          <Settings className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl shadow-lg flex items-center justify-center">
          <Briefcase className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-lg flex items-center justify-center">
          <Mail className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-xl shadow-lg flex items-center justify-center border border-gray-600">
          <Github className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg flex items-center justify-center">
          <Linkedin className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl shadow-lg flex items-center justify-center">
          <Award className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-lg flex items-center justify-center overflow-hidden relative">
          <div className="grid grid-cols-2 gap-1 p-2">
            <div className="w-5 h-5 bg-gradient-to-br from-gray-500 to-gray-700 rounded-md flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </div>
            <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-md flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </div>
            <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
              <StickyNote className="w-3 h-3 text-white" />
            </div>
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <Gamepad2 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl shadow-lg flex items-center justify-center">
          <Trash2 className="w-9 h-9 text-white drop-shadow-md" />
        </div>
      )
    },
  ];

  // Apps inside the Apps folder
  const folderApps = [
    {
      id: 'camera',
      label: 'Camera',
      icon: (
        <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl shadow-lg flex items-center justify-center">
          <Camera className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'recorder',
      label: 'Recorder',
      icon: (
        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg flex items-center justify-center">
          <Mic className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'notepad',
      label: 'Notepad',
      icon: (
        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg flex items-center justify-center">
          <StickyNote className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'games',
      label: 'Games',
      icon: (
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
          <Gamepad2 className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'calculator',
      label: 'Calculator',
      icon: (
        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg flex items-center justify-center">
          <CalcIcon className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      )
    },
    {
      id: 'weather',
      label: 'Weather',
      icon: (
        <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center">
          <CloudSun className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      )
    },
  ];

  // Boot screen
  if (isBooting) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative text-center z-10">
          {/* User Picture */}
          <div className={`transition-all duration-500 ${bootStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl shadow-purple-500/30">
              <img src="/me.png" alt="Arsham" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Title */}
          <div className={`transition-all duration-500 delay-100 ${bootStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl font-light text-white mb-1 tracking-wide">Arsham OS</h1>
            <p className="text-white/40 text-sm">Welcome back, Arsham</p>
          </div>

          {/* Loading bar */}
          <div className={`mt-10 transition-all duration-500 delay-200 ${bootStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div
                className={`h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ${bootStage >= 4 ? 'w-full' : 'w-0'}`}
              />
            </div>
            <p className="text-white/30 text-xs mt-4">
              {bootStage < 4 ? 'Starting up...' : 'Welcome'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={desktopRef}
      className="relative w-full h-full overflow-hidden select-none"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleSelectionStart}
      onMouseMove={handleSelectionMove}
      onMouseUp={handleSelectionEnd}
    >
      {/* Realistic wallpaper */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgba(79, 70, 229, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse 50% 30% at 0% 100%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
            linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)
          `
        }}
      />

      {/* Stars effect */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Desktop Icons - Main Grid */}
      <div
        className="absolute top-10 left-4 grid grid-cols-2 gap-1 z-10"
        onMouseDown={e => e.stopPropagation()}
      >
        {desktopIcons.filter(icon => icon.id !== 'trash').map((icon) => (
          <button
            key={icon.id}
            ref={(el) => { if (el) iconRefs.current.set(icon.id, el); }}
            onClick={(e) => {
              e.stopPropagation();
              if (e.ctrlKey || e.metaKey) {
                setSelectedIcons(prev =>
                  prev.includes(icon.id)
                    ? prev.filter(id => id !== icon.id)
                    : [...prev, icon.id]
                );
              } else {
                setSelectedIcons([icon.id]);
              }
            }}
            onDoubleClick={() => handleDesktopIconDoubleClick(icon.id)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150 w-[80px] group ${
              selectedIcons.includes(icon.id)
                ? 'bg-white/15 backdrop-blur-sm ring-1 ring-white/30'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="transform transition-all duration-200 group-hover:scale-105 group-active:scale-95 group-hover:-translate-y-0.5">
              {icon.icon}
            </div>
            <span
              className={`text-[10px] font-medium text-center leading-tight px-1.5 py-0.5 rounded transition-all max-w-full truncate ${
                selectedIcons.includes(icon.id)
                  ? 'bg-blue-500/90 text-white shadow-lg shadow-blue-500/30'
                  : 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              }`}
            >
              {icon.label}
            </span>
          </button>
        ))}
      </div>

      {/* Selection Rectangle */}
      {isSelecting && (
        <div
          className="absolute border border-blue-400/50 bg-blue-400/10 pointer-events-none z-[5]"
          style={{
            left: Math.min(selectionStart.x, selectionEnd.x),
            top: Math.min(selectionStart.y, selectionEnd.y),
            width: Math.abs(selectionEnd.x - selectionStart.x),
            height: Math.abs(selectionEnd.y - selectionStart.y),
          }}
        />
      )}

      {/* Clock widget */}
      <div className="absolute top-10 right-6 text-right z-10 pointer-events-none">
        <div className="text-5xl font-extralight text-white/90 drop-shadow-lg tracking-wider">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-white/50 mt-1">
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Windows */}
      {windows.map((window, index) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          initialPosition={getWindowPosition(index)}
          initialSize={getWindowSize(window.type)}
          isActive={activeWindowId === window.id}
          isMinimized={window.isMinimized}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          zIndex={windowZIndices[window.id] || 100}
        >
          {renderWindowContent(window)}
        </Window>
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute z-[9999] min-w-[200px] bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl py-1.5 overflow-hidden"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          {contextMenu.items.map((item, index) => (
            item.divider ? (
              <div key={index} className="h-px bg-white/10 my-1.5 mx-3" />
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setContextMenu(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="text-white/50">{item.icon}</span>
                {item.label}
              </button>
            )
          ))}
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="absolute top-10 right-6 mt-20 z-[100] space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 px-4 py-3 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl min-w-[280px] animate-slide-in-right"
            >
              <div className="text-white/60 mt-0.5">{notification.icon}</div>
              <div>
                <p className="text-sm font-medium text-white">{notification.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apps Folder Popup */}
      {showAppsFolder && (
        <div
          className="absolute inset-0 z-[180] flex items-center justify-center"
          onClick={() => setShowAppsFolder(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Folder Content */}
          <div
            className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">Apps</h3>
              <button
                onClick={() => setShowAppsFolder(false)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-4 gap-4">
              {folderApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    handleOpenApp(app.id);
                    setShowAppsFolder(false);
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="transform transition-transform group-hover:scale-110 group-active:scale-95">
                    {app.icon}
                  </div>
                  <span className="text-white/80 text-xs font-medium">{app.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar
        windows={windows.map(w => ({
          id: w.id,
          title: w.title,
          icon: w.icon,
          isMinimized: w.isMinimized,
        }))}
        activeWindowId={activeWindowId}
        onWindowClick={focusWindow}
        onOpenApp={handleOpenApp}
      />

      {/* Welcome hint */}
      {windows.length === 0 && !showNotification && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-5">
          <div className="text-center px-6 py-4 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5">
            <p className="text-white/50 text-sm">
              Double-click icons to open • Right-click for more options
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DesktopEnvironment;
