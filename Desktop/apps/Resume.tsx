import { useState } from 'react';
import { Download, ZoomIn, ZoomOut, ExternalLink, FileText } from 'lucide-react';

const Resume = () => {
  const [zoom, setZoom] = useState(100);
  const [pdfError, setPdfError] = useState(false);

  // PDF file path
  const pdfPath = '/resume/Seyedarsham_Hosseini_Resume.pdf';

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'Seyedarsham_Hosseini_Resume.pdf';
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(pdfPath, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-[#525659]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#3c3c3c] border-b border-black/20">
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#525659] rounded px-2 py-1">
            <button onClick={handleZoomOut} className="p-1 hover:bg-white/10 rounded transition-colors">
              <ZoomOut className="w-4 h-4 text-white/70" />
            </button>
            <span className="text-white/80 text-sm px-2 min-w-[50px] text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:bg-white/10 rounded transition-colors">
              <ZoomIn className="w-4 h-4 text-white/70" />
            </button>
          </div>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <span className="text-white/50 text-sm">Seyedarsham_Hosseini_Resume.pdf</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 rounded text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 overflow-auto bg-[#525659] flex justify-center p-4">
        {pdfError ? (
          // Fallback when PDF can't be loaded
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-white font-medium text-lg mb-2">PDF Not Found</h3>
            <p className="text-white/50 text-sm max-w-xs mb-4">
              Resume PDF file not found at the expected location.
            </p>
            <div className="text-white/30 text-xs">
              Path: /public/resume/Seyedarsham_Hosseini_Resume.pdf
            </div>
          </div>
        ) : (
          <div
            className="bg-white shadow-2xl origin-top transition-transform duration-200 overflow-hidden"
            style={{
              transform: `scale(${zoom / 100})`,
              width: '850px',
              height: '1100px',
            }}
          >
            <iframe
              src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0"
              title="Resume PDF"
              onError={() => setPdfError(true)}
            />
            {/* Fallback object tag if iframe doesn't work */}
            <object
              data={pdfPath}
              type="application/pdf"
              className="w-full h-full hidden"
              onError={() => setPdfError(true)}
            >
              <embed src={pdfPath} type="application/pdf" className="w-full h-full" />
            </object>
          </div>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="px-4 py-2 bg-[#3c3c3c] border-t border-black/20 flex items-center justify-between">
        <span className="text-white/40 text-xs">
          Tip: Click "Open" to view in full browser or "Download" to save
        </span>
        <span className="text-white/40 text-xs">
          Zoom: {zoom}%
        </span>
      </div>
    </div>
  );
};

export default Resume;
