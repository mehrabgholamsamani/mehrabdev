import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Award } from 'lucide-react';

const certificates = [
  { id: 1, src: '/1.jpg', title: 'Certificate 1' },
  { id: 2, src: '/2.jpg', title: 'Certificate 2' },
  { id: 3, src: '/3.jpg', title: 'Certificate 3' },
  { id: 4, src: '/4.jpg', title: 'Certificate 4' },
  { id: 5, src: '/5.jpg', title: 'Certificate 5' },
];

const Certificates = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
    setZoom(100);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
    setZoom(100);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setZoom(100);
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-black/30">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-yellow-400" />
          <span className="text-white/80 text-sm font-medium">
            {certificates[currentIndex].title}
          </span>
          <span className="text-white/40 text-xs">
            ({currentIndex + 1} / {certificates.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#3d3d3d] rounded px-2 py-1">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-white/70" />
            </button>
            <span className="text-white/80 text-xs px-2 min-w-[45px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>
      </div>

      {/* Main viewer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Image viewer */}
        <div className="flex-1 relative flex items-center justify-center bg-[#1a1a1a] overflow-auto p-4">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Certificate image */}
          <div
            className="relative transition-transform duration-200 cursor-pointer"
            style={{ transform: `scale(${zoom / 100})` }}
            onClick={() => setIsFullscreen(true)}
          >
            <img
              src={certificates[currentIndex].src}
              alt={certificates[currentIndex].title}
              className="max-w-full max-h-[calc(100vh-250px)] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="bg-[#2d2d2d] border-t border-black/30 p-3">
        <div className="flex justify-center gap-2">
          {certificates.map((cert, index) => (
            <button
              key={cert.id}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-16 h-12 rounded overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-yellow-400 scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={cert.src}
                alt={cert.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <img
            src={certificates[currentIndex].src}
            alt={certificates[currentIndex].title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {certificates[currentIndex].title} ({currentIndex + 1} / {certificates.length})
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
