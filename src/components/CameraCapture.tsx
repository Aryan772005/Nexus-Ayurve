import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Zap, SwitchCamera } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
  accentColor?: string; // e.g. '#4E6B52' or '#10B981'
  label?: string;
}

export default function CameraCapture({
  onCapture,
  onClose,
  accentColor = '#4E6B52',
  label = 'Take Photo',
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    stopStream();
    setError(null);
    setIsReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsReady(true);
        };
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError(`Camera unavailable: ${err.message}`);
      }
    }
  }, [stopStream]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoCams = devices.filter(d => d.kind === 'videoinput');
      setHasMultipleCameras(videoCams.length > 1);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => stopStream();
  }, [facingMode, startCamera, stopStream]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 300);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const MAX = 1024;
    let w = video.videoWidth;
    let h = video.videoHeight;
    if (w > h) {
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
    } else {
      if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (facingMode === 'user') {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    const base64 = canvas.toDataURL('image/jpeg', 0.82);
    stopStream();
    onCapture(base64);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) { stopStream(); onClose(); } }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-black rounded-3xl overflow-hidden shadow-2xl"
          style={{ border: `1.5px solid ${accentColor}50` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-sm font-bold">Live Camera</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${accentColor}25`, color: accentColor }}>
                {facingMode === 'environment' ? '📷 Back' : '🤳 Front'}
              </span>
              <button onClick={() => { stopStream(); onClose(); }} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Viewfinder */}
          <div className="relative aspect-[4/3] bg-black overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Flash */}
            <AnimatePresence>
              {flashEffect && (
                <motion.div initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white pointer-events-none" />
              )}
            </AnimatePresence>

            {/* Corner guides */}
            {isReady && (
              <>
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: accentColor }} />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: accentColor }} />
                <div className="absolute bottom-16 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: accentColor }} />
                <div className="absolute bottom-16 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: accentColor }} />
                {/* Animated scan line */}
                <div className="absolute inset-x-8 h-px opacity-60 animate-[scanLine_2s_ease-in-out_infinite]" style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
              </>
            )}

            {/* Loading overlay */}
            {!isReady && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
                <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-transparent animate-spin" style={{ borderTopColor: accentColor }} />
                <p className="text-white/60 text-xs font-semibold">Starting camera…</p>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <Camera size={28} className="text-red-400" />
                </div>
                <p className="text-white font-bold text-sm">Camera Error</p>
                <p className="text-white/60 text-xs leading-relaxed">{error}</p>
                <button onClick={() => startCamera(facingMode)} className="px-4 py-2 rounded-xl text-xs font-bold text-white mt-1" style={{ background: accentColor }}>
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-900">
            {hasMultipleCameras ? (
              <button onClick={toggleCamera} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex flex-col items-center justify-center gap-0.5 transition-all" title="Flip Camera">
                <SwitchCamera size={20} className="text-white" />
                <span className="text-[9px] text-white/50 font-semibold">FLIP</span>
              </button>
            ) : <div className="w-12 h-12" />}

            {/* Shutter */}
            <button
              onClick={capture}
              disabled={!isReady}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 shadow-lg"
              style={{ background: isReady ? accentColor : '#555', boxShadow: isReady ? `0 0 24px ${accentColor}60` : 'none' }}
              title={label}
            >
              <div className="w-16 h-16 rounded-full border-[3px] border-white/40 flex items-center justify-center">
                <Zap size={26} className="text-white" fill="white" />
              </div>
            </button>

            <button onClick={() => { stopStream(); onClose(); }} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex flex-col items-center justify-center gap-0.5 transition-all">
              <X size={20} className="text-white" />
              <span className="text-[9px] text-white/50 font-semibold">CLOSE</span>
            </button>
          </div>

          <div className="text-center pb-3 bg-zinc-900">
            <p className="text-xs text-white/30">
              {facingMode === 'environment' ? 'Point at food or label · Back camera' : 'Front camera · Selfie mode'}
              {' '}· Tap ⚡ to capture
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
