import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Trash2, Clock } from 'lucide-react';

interface Recording {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  createdAt: Date;
}

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(32).fill(0));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio visualizer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        objectUrlsRef.current.push(url);
        setRecordings(prev => [{
          id: Date.now().toString(),
          blob,
          url,
          duration: recordingTime,
          createdAt: new Date()
        }, ...prev]);
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start visualizer
      const updateVisualizer = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          setVisualizerData(Array.from(dataArray).slice(0, 32));
        }
        animationRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setVisualizerData(new Array(32).fill(0));
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const playRecording = (recording: Recording) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(recording.url);
    audioRef.current = audio;
    audio.play();
    setPlayingId(recording.id);
    audio.onended = () => setPlayingId(null);
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
  };

  const downloadRecording = (recording: Recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `recording-${recording.id}.webm`;
    a.click();
  };

  const deleteRecording = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      URL.revokeObjectURL(recording.url);
      objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== recording.url);
      setRecordings(prev => prev.filter(r => r.id !== id));
      if (playingId === id) stopPlaying();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
      {/* Recording Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {error ? (
          <div className="text-center">
            <Mic className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/60 mb-4">{error}</p>
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-blue-500 rounded-lg text-white text-sm hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Visualizer */}
            <div className="flex items-end justify-center gap-1 h-24 mb-8">
              {visualizerData.map((value, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-red-500 to-red-300 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(4, (value / 255) * 100)}%` }}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-5xl font-mono text-white mb-8">
              {formatTime(recordingTime)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
              ) : (
                <>
                  <button
                    onClick={togglePause}
                    className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPaused ? <Play className="w-6 h-6 text-white" /> : <Pause className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
                  >
                    <Square className="w-8 h-8 text-white" fill="white" />
                  </button>
                </>
              )}
            </div>

            {isRecording && (
              <p className="text-white/50 text-sm mt-4">
                {isPaused ? 'Paused' : 'Recording...'}
              </p>
            )}
          </>
        )}
      </div>

      {/* Recordings List */}
      <div className="border-t border-white/10 bg-black/30 max-h-48 overflow-auto">
        <div className="p-3">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2">
            Recordings ({recordings.length})
          </p>
          {recordings.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">No recordings yet</p>
          ) : (
            <div className="space-y-1">
              {recordings.map(recording => (
                <div
                  key={recording.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <button
                    onClick={() => playingId === recording.id ? stopPlaying() : playRecording(recording)}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
                  >
                    {playingId === recording.id ? (
                      <Square className="w-3 h-3 text-white" fill="white" />
                    ) : (
                      <Play className="w-3 h-3 text-white ml-0.5" fill="white" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm text-white/80">Recording</p>
                    <p className="text-[11px] text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(recording.duration)}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadRecording(recording)}
                    className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white opacity-0 group-hover:opacity-100"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="p-1.5 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recorder;
