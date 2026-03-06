interface TextViewerProps {
  content: string;
  fileName: string;
}

const TextViewer = ({ content, fileName }: TextViewerProps) => {
  const lines = content.split('\n');

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Content with line numbers */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Line Numbers */}
          <div
            className="sticky left-0 px-3 py-3 text-right select-none"
            style={{
              backgroundColor: '#1e1e1e',
              color: '#5a5a5a',
              minWidth: '48px',
              borderRight: '1px solid #2d2d2d'
            }}
          >
            {lines.map((_, index) => (
              <div key={index} className="text-xs leading-6 font-mono">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Content */}
          <pre
            className="flex-1 p-3 overflow-x-auto text-[13px] leading-6 font-mono"
            style={{ color: '#d4d4d4' }}
          >
            {content}
          </pre>
        </div>
      </div>

      {/* Status Bar */}
      <div
        className="flex items-center justify-between px-3 py-1 text-[11px]"
        style={{ backgroundColor: '#007acc', color: 'white' }}
      >
        <div className="flex items-center gap-4">
          <span className="opacity-90">{fileName}</span>
        </div>
        <div className="flex items-center gap-4 opacity-80">
          <span>Ln {lines.length}</span>
          <span>UTF-8</span>
          <span>Plain Text</span>
        </div>
      </div>
    </div>
  );
};

export default TextViewer;
