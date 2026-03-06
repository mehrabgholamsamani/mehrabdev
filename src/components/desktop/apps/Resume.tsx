import { Download, ExternalLink } from 'lucide-react';

const Resume = () => {
  const pdfPath = '/Mehrab_Gholamsamani_Resume.pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'Mehrab_Gholamsamani_Resume.pdf';
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(pdfPath, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-[#525659]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#3c3c3c] border-b border-black/20 flex-shrink-0">
        <span className="text-white/50 text-sm">Mehrab_Gholamsamani_Resume.pdf</span>
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

      {/* PDF Viewer — fills the remaining space */}
      <iframe
        src={pdfPath}
        className="flex-1 w-full border-0"
        title="Mehrab Gholamsamani Resume"
      />
    </div>
  );
};

export default Resume;
