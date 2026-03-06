import { useState, useEffect, ReactNode } from 'react';
import { Folder, Terminal, User, Wifi, Volume2, VolumeX, Volume1, Battery, Search, Code2, Settings, Briefcase, Mail, Camera, Mic, StickyNote, Gamepad2, Trash2, FileText, Grid3X3, HelpCircle, Calendar, Moon, Bluetooth, Zap } from 'lucide-react';

interface WindowInfo {
  id: string;
  title: string;
  icon: ReactNode;
  isMinimized: boolean;
}

interface TaskbarProps {
  windows: WindowInfo[];
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onOpenApp: (app: string) => void;
}

const Taskbar = ({ windows, activeWindowId, onWindowClick, onOpenApp }: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [batteryLevel] = useState(87);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [volume, setVolume] = useState(75);
  const [wifiConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const pinnedApps = [
    {
      id: 'filemanager',
      icon: (
        <div className="w-11 h-11 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <Folder className="w-6 h-6 text-white" fill="white" fillOpacity={0.3} />
        </div>
      ),
      name: 'Files'
    },
    {
      id: 'terminal',
      icon: (
        <div className="w-11 h-11 bg-gradient-to-b from-gray-700 to-black rounded-xl flex items-center justify-center shadow-md border border-gray-600">
          <span className="text-green-400 font-mono text-sm font-bold">{'>'}_</span>
        </div>
      ),
      name: 'Terminal'
    },
    {
      id: 'about',
      icon: (
        <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <User className="w-6 h-6 text-white" />
        </div>
      ),
      name: 'About'
    },
    {
      id: 'projects',
      icon: (
        <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
          <Code2 className="w-6 h-6 text-white" />
        </div>
      ),
      name: 'Projects'
    },
  ];

  const allApps = [
    { id: 'filemanager', name: 'Files', icon: <Folder className="w-5 h-5 text-blue-400" />, desc: 'Browse files and folders' },
    { id: 'terminal', name: 'Terminal', icon: <Terminal className="w-5 h-5 text-green-400" />, desc: 'Command line interface' },
    { id: 'about', name: 'About Me', icon: <User className="w-5 h-5 text-purple-400" />, desc: 'Learn about Mehrab' },
    { id: 'projects', name: 'Projects', icon: <Code2 className="w-5 h-5 text-cyan-400" />, desc: 'View portfolio projects' },
    { id: 'skills', name: 'Skills', icon: <Settings className="w-5 h-5 text-orange-400" />, desc: 'Technical skills overview' },
    { id: 'resume', name: 'Resume', icon: <Briefcase className="w-5 h-5 text-green-400" />, desc: 'Professional resume' },
    { id: 'contact', name: 'Contact', icon: <Mail className="w-5 h-5 text-pink-400" />, desc: 'Get in touch' },
    { id: 'camera', name: 'Camera', icon: <Camera className="w-5 h-5 text-gray-400" />, desc: 'Take photos and videos' },
    { id: 'recorder', name: 'Voice Recorder', icon: <Mic className="w-5 h-5 text-red-400" />, desc: 'Record audio' },
    { id: 'notepad', name: 'Notepad', icon: <StickyNote className="w-5 h-5 text-yellow-400" />, desc: 'Write and save notes' },
    { id: 'games', name: 'Games', icon: <Gamepad2 className="w-5 h-5 text-indigo-400" />, desc: 'Play mini games' },
    { id: 'trash', name: 'Trash', icon: <Trash2 className="w-5 h-5 text-gray-400" />, desc: 'View deleted items' },
  ];

  const filteredApps = searchQuery
    ? allApps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allApps;

  const isAppOpen = (appId: string) => {
    return windows.some(w => {
      if (appId === 'filemanager') return ['Files', 'Skills', 'Projects'].includes(w.title);
      if (appId === 'terminal') return w.title === 'Terminal';
      if (appId === 'about') return w.title === 'About Me';
      if (appId === 'projects') return w.title === 'Projects';
      return false;
    });
  };

  return (
    <>
      {/* Top Menu Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-7 bg-black/60 backdrop-blur-xl flex items-center justify-between px-4 z-[200]"
        onClick={(e) => { e.stopPropagation(); if (activeMenu && !(e.target as HTMLElement).closest('.relative')) setActiveMenu(null); }}
      >
        {/* Left */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-2 py-1 rounded text-white/80 hover:bg-white/10 transition-colors"
          >
            <img src="/me.png" alt="Mehrab" className="w-4 h-4 rounded-full object-cover" />
            <span className="text-[13px] font-semibold">Mehrab OS</span>
          </button>

          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-1 rounded text-[13px] transition-colors ${activeMenu === 'file' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl py-1 z-50">
                <button onClick={() => { onOpenApp('filemanager'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <Folder className="w-4 h-4" /> Open Files
                </button>
                <button onClick={() => { onOpenApp('terminal'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <Terminal className="w-4 h-4" /> New Terminal
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button onClick={() => { onOpenApp('notepad'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <FileText className="w-4 h-4" /> New Note
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2 py-1 rounded text-[13px] transition-colors ${activeMenu === 'view' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl py-1 z-50">
                <button onClick={() => { onOpenApp('projects'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <Code2 className="w-4 h-4" /> View Projects
                </button>
                <button onClick={() => { onOpenApp('skills'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <Settings className="w-4 h-4" /> View Skills
                </button>
                <button onClick={() => { onOpenApp('resume'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <Briefcase className="w-4 h-4" /> View Resume
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button onClick={() => { setShowSearch(true); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <Grid3X3 className="w-4 h-4" /> Show All Apps
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              className={`px-2 py-1 rounded text-[13px] transition-colors ${activeMenu === 'help' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl py-1 z-50">
                <button onClick={() => { onOpenApp('about'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <User className="w-4 h-4" /> About Mehrab
                </button>
                <button onClick={() => { onOpenApp('contact'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <Mail className="w-4 h-4" /> Contact
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <a href="https://github.com/mehrabgholamsamani" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
                  <HelpCircle className="w-4 h-4" /> GitHub Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Control Center */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'control' ? null : 'control'); }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-white/70 hover:bg-white/10 transition-colors ${activeMenu === 'control' ? 'bg-white/10' : ''}`}
            >
              {wifiConnected ? <Wifi className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-white/40" />}
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : volume < 50 ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <div className="flex items-center gap-0.5">
                <Battery className="w-4 h-4" />
                <span className="text-[11px]">{batteryLevel}%</span>
              </div>
            </button>
            {activeMenu === 'control' && (
              <div className="absolute top-full right-0 mt-1 w-72 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl p-3 z-50">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <button className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${wifiConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'}`}>
                    <Wifi className="w-5 h-5" />
                    <span className="text-[10px]">Wi-Fi</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Bluetooth className="w-5 h-5" />
                    <span className="text-[10px]">Bluetooth</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10">
                    <Moon className="w-5 h-5" />
                    <span className="text-[10px]">Focus</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10">
                    <Zap className="w-5 h-5" />
                    <span className="text-[10px]">Power</span>
                  </button>
                </div>

                <div className="bg-white/5 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-white/60" />
                    <span className="text-[12px] text-white/60">Sound</span>
                    <span className="text-[12px] text-white/40 ml-auto">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                  />
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-green-400" />
                    <span className="text-[12px] text-white/80">Battery</span>
                    <span className="text-[12px] text-green-400 ml-auto">{batteryLevel}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: `${batteryLevel}%` }} />
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">Power Source: Battery</p>
                </div>
              </div>
            )}
          </div>

          <div className="h-3 w-px bg-white/20 mx-1" />

          {/* Date & Time */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'datetime' ? null : 'datetime'); }}
              className={`flex items-center gap-2 px-2 py-1 rounded text-white/90 hover:bg-white/10 transition-colors ${activeMenu === 'datetime' ? 'bg-white/10' : ''}`}
            >
              <span className="text-[13px]">{formatDate(currentTime)}</span>
              <span className="text-[13px] font-medium">{formatTime(currentTime)}</span>
            </button>
            {activeMenu === 'datetime' && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl p-4 z-50">
                <div className="text-center mb-4">
                  <div className="text-4xl font-light text-white tracking-wide">{formatTime(currentTime)}</div>
                  <div className="text-sm text-white/50 mt-1">
                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-white/80">
                      {currentTime.toLocaleDateString([], { month: 'long', year: 'numeric' })}
                    </span>
                    <Calendar className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-white/40 py-1">{day}</div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                      const firstDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1).getDay();
                      const daysInMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
                      const day = i - firstDay + 1;
                      const isCurrentDay = day === currentTime.getDate();
                      const isValidDay = day > 0 && day <= daysInMonth;
                      return (
                        <div
                          key={i}
                          className={`py-1 rounded ${isCurrentDay ? 'bg-blue-500 text-white' : isValidDay ? 'text-white/70' : 'text-white/20'}`}
                        >
                          {isValidDay ? day : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 text-center text-[11px] text-white/40">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              </div>
            )}
          </div>

          <div className="h-3 w-px bg-white/20 mx-1" />

          {/* User Avatar */}
          <button
            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'user' ? null : 'user'); }}
            className="relative"
          >
            <img src="/me.png" alt="Mehrab" className={`w-5 h-5 rounded-full object-cover ring-1 transition-all ${activeMenu === 'user' ? 'ring-white/40' : 'ring-white/20 hover:ring-white/30'}`} />
            {activeMenu === 'user' && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl py-2 z-50">
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img src="/me.png" alt="Mehrab" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-[13px] font-medium text-white">Mehrab</p>
                      <p className="text-[11px] text-white/40">Full-Stack Developer</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => { onOpenApp('about'); setActiveMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10">
                  <User className="w-4 h-4" /> About Me
                </button>
                <button onClick={() => { onOpenApp('contact'); setActiveMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/80 hover:bg-white/10">
                  <Mail className="w-4 h-4" /> Contact
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/40 cursor-not-allowed">
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Dock */}
      <div
        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-[200]"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-end gap-1.5 px-2.5 py-2 rounded-2xl border border-white/[0.08]"
          style={{
            background: 'rgba(30, 30, 30, 0.75)',
            backdropFilter: 'blur(40px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          {pinnedApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="relative p-1 rounded-xl transition-all duration-200 group"
              title={app.name}
            >
              <div className="transform transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-2 group-active:scale-95">
                {app.icon}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              {isAppOpen(app.id) && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full" />
              )}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                {app.name}
              </span>
            </button>
          ))}

          {windows.length > 0 && (
            <div className="w-px h-10 bg-white/10 mx-1 self-center" />
          )}

          {windows.map((win) => (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={`relative p-1 rounded-xl transition-all duration-200 group ${
                activeWindowId === win.id ? 'bg-white/10' : ''
              }`}
              title={win.title}
            >
              <div className={`w-11 h-11 bg-gray-700/90 rounded-xl flex items-center justify-center border border-white/10 transform transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-2 ${
                win.isMinimized ? 'opacity-50' : ''
              }`}>
                <span className="scale-110">{win.icon}</span>
              </div>
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 transition-all ${
                activeWindowId === win.id
                  ? 'w-2.5 h-1 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50'
                  : 'w-1 h-1 bg-white/50 rounded-full'
              }`} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                {win.title}
              </span>
            </button>
          ))}

          <div className="w-px h-10 bg-white/10 mx-1 self-center" />

          <button
            onClick={() => setShowSearch(true)}
            className="relative p-1 rounded-xl transition-all duration-200 group"
            title="Search"
          >
            <div className="w-11 h-11 bg-gradient-to-b from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-md transform transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-2">
              <Search className="w-5 h-5 text-white/70" />
            </div>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
              Search
            </span>
          </button>

          <div className="w-px h-10 bg-white/10 mx-1 self-center" />

          <button
            onClick={() => onOpenApp('trash')}
            className="relative p-1 rounded-xl transition-all duration-200 group"
            title="Trash"
          >
            <div className="w-11 h-11 bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-md transform transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-2">
              <Trash2 className="w-5 h-5 text-white/70" />
            </div>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
              Trash
            </span>
          </button>
        </div>
      </div>

      {/* Search/Spotlight Overlay */}
      {showSearch && (
        <div
          className="absolute inset-0 z-[500] flex items-start justify-center pt-24"
          style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(20px)' }}
          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
        >
          <div
            className="w-[540px] overflow-hidden rounded-2xl border border-white/10"
            style={{ background: 'rgba(40, 40, 40, 0.95)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Search apps and files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-lg placeholder-white/30 outline-none"
                autoFocus
              />
              <kbd className="px-2 py-0.5 text-[10px] text-white/30 bg-white/5 rounded border border-white/10">ESC</kbd>
            </div>

            <div className="max-h-[400px] overflow-auto">
              <div className="p-2">
                <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider px-3 py-2">Applications</p>
                <div className="space-y-0.5">
                  {filteredApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => { onOpenApp(app.id); setShowSearch(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center">
                        {app.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium block">{app.name}</span>
                        <span className="text-[11px] text-white/40">{app.desc}</span>
                      </div>
                      <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded">App</span>
                    </button>
                  ))}
                </div>
              </div>

              {!searchQuery && (
                <div className="p-2 border-t border-white/5">
                  <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider px-3 py-2">Quick Actions</p>
                  <div className="grid grid-cols-3 gap-2 px-2">
                    {[
                      { label: 'New Terminal', icon: <Terminal className="w-4 h-4" />, action: () => onOpenApp('terminal') },
                      { label: 'View Resume', icon: <Briefcase className="w-4 h-4" />, action: () => onOpenApp('resume') },
                      { label: 'Contact Me', icon: <Mail className="w-4 h-4" />, action: () => onOpenApp('contact') },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { item.action(); setShowSearch(false); }}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className="text-white/50">{item.icon}</div>
                        <span className="text-[11px] text-white/60">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Taskbar;
