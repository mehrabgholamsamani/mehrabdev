import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Trash as TrashIcon, FileText, Folder, Image, Music, Film, Clock, AlertTriangle } from 'lucide-react';

interface TrashItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image' | 'audio' | 'video';
  size: string;
  deletedAt: Date;
}

const Trash = () => {
  const [items, setItems] = useState<TrashItem[]>(() => {
    const saved = localStorage.getItem('portfolio-trash');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'old_notes.txt', type: 'file', size: '2.4 KB', deletedAt: new Date(Date.now() - 86400000) },
      { id: '2', name: 'unused_images', type: 'folder', size: '15.2 MB', deletedAt: new Date(Date.now() - 172800000) },
      { id: '3', name: 'screenshot.png', type: 'image', size: '456 KB', deletedAt: new Date(Date.now() - 259200000) },
      { id: '4', name: 'recording.mp3', type: 'audio', size: '3.1 MB', deletedAt: new Date(Date.now() - 345600000) },
    ];
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('portfolio-trash', JSON.stringify(items));
  }, [items]);

  const getIcon = (type: TrashItem['type']) => {
    switch (type) {
      case 'folder': return <Folder className="w-5 h-5 text-blue-400" />;
      case 'image': return <Image className="w-5 h-5 text-green-400" />;
      case 'audio': return <Music className="w-5 h-5 text-purple-400" />;
      case 'video': return <Film className="w-5 h-5 text-red-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i.id));
    }
  };

  const restoreItems = () => {
    setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    // In a real app, this would restore files to their original location
  };

  const deleteForever = () => {
    setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setShowConfirm(false);
  };

  const emptyTrash = () => {
    setItems([]);
    setSelectedItems([]);
    setShowConfirm(false);
  };

  const totalSize = items.reduce((acc, item) => {
    const num = parseFloat(item.size);
    const unit = item.size.includes('MB') ? 1024 : 1;
    return acc + num * unit;
  }, 0);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252525] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h2 className="text-white font-medium">Trash</h2>
            <p className="text-white/40 text-xs">{items.length} items • {totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize.toFixed(1)} KB`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <>
              <button
                onClick={restoreItems}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
          {items.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-white/50 hover:text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
            >
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30">
            <Trash2 className="w-20 h-20 mb-4 opacity-30" />
            <p className="text-lg font-medium">Trash is empty</p>
            <p className="text-sm mt-1">Items you delete will appear here</p>
          </div>
        ) : (
          <div className="p-2">
            {/* Select All */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5 mb-2">
              <input
                type="checkbox"
                checked={selectedItems.length === items.length}
                onChange={selectAll}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              <span className="text-white/40 text-sm">
                {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-1">
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    selectedItems.includes(item.id)
                      ? 'bg-blue-500/20 ring-1 ring-blue-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    onClick={e => e.stopPropagation()}
                    className="w-4 h-4 rounded bg-white/10 border-white/20"
                  />
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm truncate">{item.name}</p>
                    <p className="text-white/30 text-xs flex items-center gap-2">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.deletedAt)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Delete Permanently?</h3>
                <p className="text-white/50 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={selectedItems.length > 0 ? deleteForever : emptyTrash}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {selectedItems.length > 0 ? 'Delete Selected' : 'Empty Trash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trash;
