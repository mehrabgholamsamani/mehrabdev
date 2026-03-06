import { useState } from 'react';
import { Folder, FileText, ChevronRight, Home, ArrowLeft, ArrowRight, Grid, List, Search, Star, Clock, HardDrive } from 'lucide-react';
import { getItemAtPath, FileSystemItem } from '../fileSystem';

interface FileManagerProps {
  onOpenFile: (path: string, content: string, name: string) => void;
  initialPath?: string;
}

const FileManager = ({ onOpenFile, initialPath = '/home/mehrab' }: FileManagerProps) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFolder = getItemAtPath(currentPath);
  const items = currentFolder?.children || [];
  const filteredItems = searchQuery
    ? items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'folder' ? -1 : 1;
  });

  const navigateTo = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedItem(null);
    setSearchQuery('');
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedItem(null);
    }
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    const itemPath = `${currentPath}/${item.name}`.replace('//', '/');
    if (item.type === 'folder') {
      navigateTo(itemPath);
    } else if (item.content) {
      onOpenFile(itemPath, item.content, item.name);
    }
  };

  const getFileIcon = (item: FileSystemItem, size: 'sm' | 'lg' = 'lg') => {
    const iconSize = size === 'lg' ? 'w-11 h-11' : 'w-5 h-5';
    const innerSize = size === 'lg' ? 'w-6 h-6' : 'w-3.5 h-3.5';

    if (item.type === 'folder') {
      return (
        <div className={`${iconSize} bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm`}>
          <Folder className={`${innerSize} text-white`} fill="white" fillOpacity={0.3} />
        </div>
      );
    }

    return (
      <div className={`${iconSize} bg-gradient-to-b from-gray-400 to-gray-600 rounded-lg flex items-center justify-center shadow-sm`}>
        <FileText className={`${innerSize} text-white`} />
      </div>
    );
  };

  const sidebarItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Home', path: '/home/mehrab' },
    { icon: <Star className="w-4 h-4 text-amber-400" />, label: 'Projects', path: '/home/mehrab/projects' },
    { icon: <Clock className="w-4 h-4 text-blue-400" />, label: 'Recent', path: '/home/mehrab' },
  ];

  const locations = [
    { label: 'Skills', path: '/home/mehrab/skills' },
    { label: 'Projects', path: '/home/mehrab/projects' },
  ];

  return (
    <div className="flex h-full text-white" style={{ background: '#232323' }}>
      {/* Sidebar */}
      <div className="w-48 border-r border-white/5 flex flex-col" style={{ background: '#1d1d1d' }}>
        <div className="p-3 flex-1">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-2">Favorites</p>
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigateTo(item.path)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors mb-0.5 ${
                currentPath === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <span className="text-white/50">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2 px-2 mt-4">Locations</p>
          {locations.map((loc) => (
            <button
              key={loc.path}
              onClick={() => navigateTo(loc.path)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors mb-0.5 ${
                currentPath === loc.path
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <Folder className="w-4 h-4 text-blue-400" />
              {loc.label}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Portfolio Drive</span>
          </div>
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-blue-500 rounded-full" />
          </div>
          <p className="text-[10px] text-white/30 mt-1">42 KB used</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5" style={{ background: '#282828' }}>
          <div className="flex items-center gap-1">
            <button
              onClick={goBack}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-white/70" />
            </button>
          </div>

          <div className="flex items-center gap-1 flex-1 min-w-0 text-[13px]">
            {currentPath.split('/').filter(p => p).map((part, index, arr) => (
              <div key={index} className="flex items-center min-w-0">
                {index > 0 && <ChevronRight className="w-3 h-3 text-white/30 mx-1 flex-shrink-0" />}
                <button
                  onClick={() => navigateTo('/' + arr.slice(0, index + 1).join('/'))}
                  className={`px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors truncate ${
                    index === arr.length - 1 ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {part === 'home' ? '🏠' : part === 'mehrab' ? 'Home' : part}
                </button>
              </div>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 bg-white/5 border border-white/10 rounded-md pl-8 pr-2 py-1 text-[12px] text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:w-40 transition-all"
            />
          </div>

          <div className="flex items-center bg-white/5 rounded-md p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3" onClick={() => setSelectedItem(null)}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-5 gap-1">
              {sortedItems.map((item) => (
                <button
                  key={item.name}
                  onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${
                    selectedItem === item.name
                      ? 'bg-blue-500/20 ring-1 ring-blue-500/40'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="transform transition-transform hover:scale-105">
                    {getFileIcon(item, 'lg')}
                  </div>
                  <span className={`text-[11px] text-center break-all line-clamp-2 leading-tight ${
                    selectedItem === item.name ? 'text-white' : 'text-white/70'
                  }`}>
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-white/40 border-b border-white/5">
                <span className="flex-1">Name</span>
                <span className="w-20">Kind</span>
                <span className="w-20">Size</span>
              </div>
              {sortedItems.map((item) => (
                <button
                  key={item.name}
                  onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                    selectedItem === item.name
                      ? 'bg-blue-500/20 ring-1 ring-blue-500/40'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {getFileIcon(item, 'sm')}
                  <span className={`flex-1 text-[13px] text-left truncate ${
                    selectedItem === item.name ? 'text-white' : 'text-white/70'
                  }`}>
                    {item.name}
                  </span>
                  <span className="w-20 text-[11px] text-white/40">
                    {item.type === 'folder' ? 'Folder' : 'Document'}
                  </span>
                  <span className="w-20 text-[11px] text-white/40">
                    {item.type === 'folder' ? '--' : '4 KB'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {sortedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-white/30">
              <Folder className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-sm">{searchQuery ? 'No matches found' : 'This folder is empty'}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/5 text-[11px] text-white/40" style={{ background: '#282828' }}>
          <span>{sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}</span>
          {selectedItem && <span>"{selectedItem}" selected</span>}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
