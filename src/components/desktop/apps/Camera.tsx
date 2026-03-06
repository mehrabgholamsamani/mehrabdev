import { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, Video, Circle, Square, Download, RotateCcw, Image } from 'lucide-react';

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: mode === 'video'
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const takePhoto = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setCapturedImage(canvas.toDataURL('image/png'));
      }
    }
  };

  const startRecording = () => {
    if (stream) {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadPhoto = () => {
    if (capturedImage) {
      const a = document.createElement('a');
      a.href = capturedImage;
      a.download = `photo-${Date.now()}.png`;
      a.click();
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              mode === 'photo' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            <CameraIcon className="w-4 h-4" />
            Photo
          </button>
          <button
            onClick={() => setMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              mode === 'video' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            Video
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-center text-white/60 p-8">
            <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 rounded-lg text-white text-sm hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain" />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-full object-contain transform scale-x-[-1]"
            />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-8xl font-bold text-white animate-pulse">{countdown}</span>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">REC</span>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-4 bg-gray-900 border-t border-gray-800">
        {capturedImage ? (
          <>
            <button
              onClick={retake}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button
              onClick={downloadPhoto}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Save
            </button>
          </>
        ) : mode === 'photo' ? (
          <button
            onClick={takePhoto}
            disabled={!!error || countdown !== null}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <div className="w-14 h-14 border-4 border-gray-900 rounded-full" />
          </button>
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!!error}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-white hover:bg-gray-200'
            }`}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" fill="white" />
            ) : (
              <Circle className="w-10 h-10 text-red-500" fill="currentColor" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;
