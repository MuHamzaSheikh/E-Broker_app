import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, Image as ImageIcon, MapPin, SwitchCamera, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  label?: string;
  required?: boolean;
  watermarkLocation?: string;
  autoOpen?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  label = 'Take Real-Time Photo',
  required = false,
  watermarkLocation,
  autoOpen = false
}) => {
  const { language, playVoiceHelp } = useApp();
  const [isCameraOpen, setIsCameraOpen] = useState(autoOpen);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOpen(true);
      playVoiceHelp(
        language === 'ur'
          ? 'کیمرہ کھل گیا ہے۔ مال کے سامنے رکھ کر گول بٹن دبائیں اور تصویر لیں۔'
          : 'Live camera active. Frame the cargo and tap the round button to capture.'
      );
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        language === 'ur'
          ? 'کیمرہ آن نہیں ہو سکا۔ براہ کرم گیلری یا کیمرہ فائل منتخب کریں۔'
          : 'Camera stream blocked. Please select file / camera input below.'
      );
      // Automatically trigger file input fallback
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (autoOpen) {
      startCamera();
    }
  }, [autoOpen]);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Geotag & Timestamp Watermark Bar
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Karachi' });
    const locationText = watermarkLocation || 'Pakistan Highway Corridor';

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, canvas.height - 45, canvas.width, 45);

    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`📍 ${locationText}  |  🕒 ${timestamp} PKT`, 16, canvas.height - 18);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    onCapture(dataUrl);
    stopCamera();

    playVoiceHelp(
      language === 'ur'
        ? 'تصویر محفوظ ہو گئی ہے۔'
        : 'Photo captured and stamped.'
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Karachi' });
          const locationText = watermarkLocation || 'Verified Location';

          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          const barHeight = Math.max(40, Math.floor(img.height * 0.06));
          ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

          ctx.fillStyle = '#34D399';
          ctx.font = `bold ${Math.max(16, Math.floor(barHeight * 0.45))}px sans-serif`;
          ctx.fillText(`📍 ${locationText}  |  🕒 ${timestamp} PKT`, 16, canvas.height - Math.floor(barHeight * 0.35));

          const watermarkedUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(watermarkedUrl);
          onCapture(watermarkedUrl);
          stopCamera();
        }
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-black text-slate-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-emerald-600" />
          <span>{label}</span>
          {required && <span className="text-rose-600 font-bold">*</span>}
        </label>
        {watermarkLocation && (
          <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {watermarkLocation}
          </span>
        )}
      </div>

      {/* Hidden file/native camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Captured Image Preview */}
      {capturedImage ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-950 aspect-video shadow-md group">
          <img src={capturedImage} alt="Real-Time Captured Proof" className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCapturedImage(null);
                startCamera();
              }}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              {language === 'ur' ? 'دوبارہ تصویر لیں' : 'Retake Photo'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCapturedImage(null);
              }}
              className="p-2 rounded-xl bg-rose-600 text-white font-black text-xs shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md">
            <Check className="w-4 h-4" />
            {language === 'ur' ? 'تصویر تیار ہے' : 'Photo Captured'}
          </div>
        </div>
      ) : (
        /* Big Open Camera Button */
        <div className="space-y-2">
          <button
            type="button"
            onClick={startCamera}
            className="w-full py-4 px-5 rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-950 font-black text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="text-sm sm:text-base font-black text-slate-900">
                {language === 'ur' ? '📸 کیمرہ کھولیں اور تصویر کھینچیں' : '📸 Open Camera & Take Real-Time Photo'}
              </div>
              <div className="text-xs text-emerald-700 font-bold">
                {language === 'ur' ? 'لائیو کیمرہ آن کر کے فوری تصویر بنائیں' : 'Tap to start live viewfinder'}
              </div>
            </div>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline inline-flex items-center gap-1 cursor-pointer py-1"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {language === 'ur' ? 'یا گیلری سے فوٹو منتخب کریں' : 'Or pick photo from gallery/files'}
            </button>
          </div>

          {cameraError && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>
      )}

      {/* Full-Screen / Large Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-black font-mono tracking-wider text-emerald-400">
                  {language === 'ur' ? 'لائیو کیمرہ فعال ہے' : 'LIVE CAMERA ACTIVE'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Switch Front/Back Camera"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Live Video Viewfinder */}
            <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Aiming Grid Overlay */}
              <div className="absolute inset-6 border-2 border-emerald-400/50 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between text-emerald-400 text-xs font-mono font-black">
                  <span>[ + ]</span>
                  <span>[ + ]</span>
                </div>
                <div className="text-center text-white/90 text-xs font-black bg-black/60 py-1 px-3 rounded-full mx-auto backdrop-blur-xs">
                  {language === 'ur' ? 'مال کو فریم کے اندر رکھیں' : 'Align cargo within frame'}
                </div>
                <div className="flex justify-between text-emerald-400 text-xs font-mono font-black">
                  <span>📍 {watermarkLocation || 'PAKISTAN GPS'}</span>
                  <span>[ + ]</span>
                </div>
              </div>
            </div>

            {/* Shutter Footer */}
            <div className="p-5 bg-slate-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  fileInputRef.current?.click();
                }}
                className="text-xs text-slate-400 hover:text-white font-bold underline cursor-pointer"
              >
                {language === 'ur' ? 'گیلری سے منتخب کریں' : 'Pick from Gallery'}
              </button>

              {/* Big Red/Green Shutter Button */}
              <button
                type="button"
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white border-4 border-emerald-500 shadow-primary-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Take Picture"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-inner">
                  <Camera className="w-8 h-8 stroke-[2.5]" />
                </div>
              </button>

              <div className="w-16"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
