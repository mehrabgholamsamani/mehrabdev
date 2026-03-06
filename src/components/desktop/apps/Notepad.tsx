import { useState, useEffect } from 'react';
import { Save, FileText, Download, Trash2, Clock } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

const Notepad = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('portfolio-notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Welcome Note', content: 'Welcome to Notepad!\n\nCreate and save your notes here.\nYour notes are saved automatically.', updatedAt: new Date() }
    ];
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [showSaved, setShowSaved] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    localStorage.setItem('portfolio-notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === activeNoteId
        ? { ...note, content, updatedAt: new Date(), title: content.split('\n')[0].slice(0, 30) || 'Untitled Note' }
        : note
    ));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1500);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.find(n => n.id !== id)?.id || null);
    }
  };

  const downloadNote = () => {
    if (activeNote) {
      const blob = new Blob([activeNote.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeNote.title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex bg-[#1e1e1e]">
      {/* Sidebar */}
      <div className="w-56 bg-[#181818] border-r border-white/5 flex flex-col">
        <div className="p-3 border-b border-white/5">
          <button
            onClick={createNote}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            New Note
          </button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`w-full text-left px-3 py-2.5 transition-colors group ${
                activeNoteId === note.id
                  ? 'bg-white/10 border-l-2 border-blue-500'
                  : 'hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activeNoteId === note.id ? 'text-white' : 'text-white/80'}`}>
                    {note.title}
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(note.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </button>
          ))}
          {notes.length === 0 && (
            <p className="text-center text-white/30 text-sm py-8">No notes yet</p>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252525] border-b border-white/5">
              <span className="text-sm text-white/60">{activeNote.title}</span>
              <div className="flex items-center gap-2">
                {showSaved && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    Saved
                  </span>
                )}
                <button
                  onClick={downloadNote}
                  className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text Area */}
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(e.target.value)}
              placeholder="Start writing..."
              className="flex-1 p-4 bg-transparent text-white/90 text-sm leading-relaxed resize-none focus:outline-none placeholder-white/30 font-mono"
              spellCheck={false}
            />

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#252525] border-t border-white/5 text-[11px] text-white/40">
              <span>{activeNote.content.length} characters</span>
              <span>{activeNote.content.split(/\s+/).filter(w => w).length} words</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/30">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notepad;
