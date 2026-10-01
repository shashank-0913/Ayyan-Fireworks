import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  LogOut, 
  ShieldCheck, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Clock,
  Search,
  RotateCcw
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Booking } from '../../types';
import { formatDateReadable } from '../../lib/utils';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { 
  stopAllCameraMediaTracks, 
  cleanupScannerInstance, 
  getCameraErrorMessage, 
  extractCleanQrPayload,
  startScannerWithFallback
} from '../../lib/cameraUtils';

// Synthesized Web Audio Tones (No external audio file dependencies)
function playScanTone(type: 'success' | 'error' | 'warning', soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // Crisp 2-tone melodic success chime (D5 -> A5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'warning') {
      // Amber warning tone (dual cautionary beep 440Hz -> 370Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(370, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Deep double reject buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.setValueAtTime(90, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio context not allowed without interaction or unsupported
  }
}

interface ScanLogItem {
  id: string;
  token: string;
  bookingCode?: string;
  customerName?: string;
  customerPhone?: string;
  slotTime?: string;
  slotDate?: string;
  status: 'confirmed' | 'completed' | 'early_arrival' | 'expired' | 'invalid';
  message: string;
  timestamp: string;
}

export const GateScannerPage: React.FC = () => {
  const { verifyGateTicket, staffLogout } = useAyyanStore();
  const navigate = useNavigate();

  // Scanner Hardware State
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Verification Result State
  const [scanState, setScanState] = useState<'idle' | 'processing' | 'confirmed' | 'completed' | 'early_arrival' | 'expired' | 'invalid'>('idle');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [verifiedAtString, setVerifiedAtString] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(3);
  const [lastScannedText, setLastScannedText] = useState<string>('');

  // Manual Input Form
  const [manualInput, setManualInput] = useState<string>('');
  const [isManualVerifying, setIsManualVerifying] = useState<boolean>(false);

  // Scan History Log
  const [scanHistory, setScanHistory] = useState<ScanLogItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Refs
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const resetTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const handleSignOut = async () => {
    if (window.confirm('Sign out from Gate Pass Verification Station?')) {
      await staffLogout();
      navigate('/gate/login', { replace: true });
    }
  };

  // Immediate Reset to ready state
  const resetScannerState = useCallback(() => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setScanState('idle');
    setActiveBooking(null);
    setStatusMessage('');
    isProcessingRef.current = false;
  }, []);

  // Handle Scan Verification Core Logic
  const processVerification = useCallback(async (tokenOrCode: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setScanState('processing');
    setLastScannedText(tokenOrCode);

    try {
      const result = await verifyGateTicket(tokenOrCode);

      if (result.status === 'confirmed') {
        // Valid & Confirmed: Access Granted
        setScanState('confirmed');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message || 'Access Granted — Admission Verified');
        setVerifiedAtString(result.verified_at || new Date().toISOString());
        playScanTone('success', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);

        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            bookingCode: result.booking?.booking_code,
            customerName: result.booking?.customer_name,
            customerPhone: result.booking?.customer_phone,
            slotTime: result.slot_time || result.booking?.slot_time,
            slotDate: result.slot_date || result.booking?.slot_date,
            status: 'confirmed',
            message: result.message || 'Access Granted',
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 19)
        ]);

      } else if (result.status === 'early_arrival') {
        // Too Early! Reject with status 'EARLY_ARRIVAL'
        setScanState('early_arrival');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message);
        setVerifiedAtString('');
        playScanTone('warning', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([150, 100, 150]);

        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            bookingCode: result.booking?.booking_code,
            customerName: result.booking?.customer_name,
            customerPhone: result.booking?.customer_phone,
            slotTime: result.slot_time || result.booking?.slot_time,
            slotDate: result.slot_date || result.booking?.slot_date,
            status: 'early_arrival',
            message: result.message,
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 19)
        ]);

      } else if (result.status === 'expired') {
        // Slot Expired! Reject with status 'EXPIRED'
        setScanState('expired');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message);
        setVerifiedAtString('');
        playScanTone('error', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([300]);

        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            bookingCode: result.booking?.booking_code,
            customerName: result.booking?.customer_name,
            customerPhone: result.booking?.customer_phone,
            slotTime: result.slot_time || result.booking?.slot_time,
            slotDate: result.slot_date || result.booking?.slot_date,
            status: 'expired',
            message: result.message,
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 19)
        ]);

      } else if (result.status === 'completed') {
        // Already Scanned: Reject re-entry
        setScanState('completed');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message || 'Already Scanned');
        setVerifiedAtString(result.verified_at || '');
        playScanTone('error', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([300]);

        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            bookingCode: result.booking?.booking_code,
            customerName: result.booking?.customer_name,
            customerPhone: result.booking?.customer_phone,
            slotTime: result.slot_time || result.booking?.slot_time,
            slotDate: result.slot_date || result.booking?.slot_date,
            status: 'completed',
            message: result.message || 'Already Scanned',
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 19)
        ]);

      } else {
        // Invalid or Fake Ticket
        setScanState('invalid');
        setActiveBooking(null);
        setStatusMessage('Invalid or Unrecognized Pass!');
        setVerifiedAtString('');
        playScanTone('error', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            status: 'invalid',
            message: 'Invalid or Fake Ticket!',
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 19)
        ]);
      }

      // 4-second Auto-reset countdown
      setCountdown(4);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

      let timeLeft = 4;
      countdownIntervalRef.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdownIntervalRef.current);
        }
      }, 1000);

      resetTimerRef.current = setTimeout(() => {
        resetScannerState();
      }, 4000);

    } catch (err: any) {
      console.error('Verification error:', err);
      setScanState('invalid');
      setStatusMessage('Verification Error: ' + (err.message || 'Network error'));
      setTimeout(() => resetScannerState(), 3000);
    }
  }, [verifyGateTicket, soundEnabled, resetScannerState]);

  // Manual fallback verification submission
  // Manual code input verification
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = extractCleanQrPayload(manualInput);
    if (!clean) return;
    setIsManualVerifying(true);
    await processVerification(clean);
    setIsManualVerifying(false);
    setManualInput('');
  };

  // Restart camera action
  const restartCamera = useCallback(async () => {
    setCameraError(null);
    stopAllCameraMediaTracks();
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (e) {}
      try {
        html5QrCodeRef.current.clear();
      } catch (e) {}
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
    setTimeout(() => {
      setCameraActive(true);
    }, 150);
  }, []);

  // Safety page exit listener to always release camera hardware
  useEffect(() => {
    const handleExit = () => {
      stopAllCameraMediaTracks();
    };
    window.addEventListener('beforeunload', handleExit);
    window.addEventListener('pagehide', handleExit);
    return () => {
      window.removeEventListener('beforeunload', handleExit);
      window.removeEventListener('pagehide', handleExit);
      stopAllCameraMediaTracks();
    };
  }, []);

  // Initialize and attach camera stream
  useEffect(() => {
    let isMounted = true;
    const scannerElementId = 'gate-qr-viewfinder';

    const initScanner = async () => {
      try {
        setCameraError(null);

        // Pre-emptively stop any stale camera tracks
        stopAllCameraMediaTracks();

        // Get available camera devices if permitted
        try {
          const devices = await Html5Qrcode.getCameras();
          if (isMounted && devices && devices.length > 0) {
            setAvailableCameras(devices.map(d => ({ id: d.id, label: d.label || `Camera ${d.id.substring(0, 4)}` })));
          }
        } catch (e) {}

        if (!cameraActive) return;

        // Clean up previous instance
        if (html5QrCodeRef.current) {
          try {
            if (html5QrCodeRef.current.isScanning) {
              await html5QrCodeRef.current.stop();
            }
          } catch (e) {}
          try {
            html5QrCodeRef.current.clear();
          } catch (e) {}
          html5QrCodeRef.current = null;
        }
        stopAllCameraMediaTracks();

        const html5QrCode = new Html5Qrcode(scannerElementId);
        html5QrCodeRef.current = html5QrCode;

        const config: Html5QrcodeCameraScanConfig = {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edgeSize = Math.floor(minEdge * 0.75);
            return { width: edgeSize, height: edgeSize };
          },
          aspectRatio: 1.0,
        };

        await startScannerWithFallback(
          html5QrCode,
          config,
          selectedCameraId || undefined,
          (decodedText) => {
            if (isMounted && !isProcessingRef.current) {
              const cleaned = extractCleanQrPayload(decodedText);
              processVerification(cleaned || decodedText);
            }
          }
        );
      } catch (err: any) {
        stopAllCameraMediaTracks();
        if (isMounted) {
          console.warn('Gate camera initiation error:', err);
          setCameraError(getCameraErrorMessage(err));
        }
      }
    };

    if (cameraActive) {
      initScanner();
    }

    return () => {
      isMounted = false;
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      
      const currentScanner = html5QrCodeRef.current;
      html5QrCodeRef.current = null;
      cleanupScannerInstance(currentScanner).catch(() => {});
      stopAllCameraMediaTracks();
    };
  }, [cameraActive, selectedCameraId, processVerification]);

  const toggleCamera = async () => {
    if (cameraActive) {
      const currentScanner = html5QrCodeRef.current;
      html5QrCodeRef.current = null;
      await cleanupScannerInstance(currentScanner);
      stopAllCameraMediaTracks();
      setCameraActive(false);
    } else {
      setCameraActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR / BRAND HEADER                                             */}
      {/* ========================================================================= */}
      <header className="bg-slate-900/90 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Gate Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-gold-600 p-0.5 border border-amber-400/50 shadow-glow-gold flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-1 overflow-hidden">
                <img src="/ayyan-emblem.png" alt="Bunny Brand" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight gold-gradient-text">
                  AYYAN FIREWORKS
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-gold-300 border border-amber-500/40 uppercase">
                  Gate
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Gate Pass Verification Station
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/15 border-amber-500/30 text-gold-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
              title={soundEnabled ? 'Chime Sound Enabled' : 'Chime Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Camera Switch Toggle */}
            {availableCameras.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = availableCameras.findIndex(c => c.id === selectedCameraId);
                  const nextIndex = (currentIndex + 1) % availableCameras.length;
                  setSelectedCameraId(availableCameras[nextIndex].id);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-all min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                title="Switch Camera Lens"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all min-h-[38px] cursor-pointer"
              title="Sign Out of Gate Station"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN GATE SCANNER WORKSPACE (CENTERED & MOBILE OPTIMIZED)              */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 sm:py-6 space-y-4 flex flex-col justify-start">
        
        {/* ======================================================================= */}
        {/* CAMERA VIEWFINDER CARD                                                  */}
        {/* ======================================================================= */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-black border-2 border-amber-500/40 shadow-2xl p-3 sm:p-4 flex flex-col items-center justify-center">
          
          {/* HTML5 QR Camera Target Box */}
          <div className="relative w-full aspect-square max-w-sm rounded-2xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
            <div id="gate-qr-viewfinder" className="w-full h-full object-cover" />

            {/* Animated Laser Overlay in Idle Mode */}
            {cameraActive && scanState === 'idle' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5">
                {/* 4 Corner Crosshairs */}
                <div className="flex justify-between">
                  <div className="w-7 h-7 border-t-4 border-l-4 border-amber-400 rounded-tl-xl shadow-glow-gold" />
                  <div className="w-7 h-7 border-t-4 border-r-4 border-amber-400 rounded-tr-xl shadow-glow-gold" />
                </div>

                {/* Sweeping Laser Line */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#f59e0b] animate-bounce" />

                <div className="flex justify-between">
                  <div className="w-7 h-7 border-b-4 border-l-4 border-amber-400 rounded-bl-xl shadow-glow-gold" />
                  <div className="w-7 h-7 border-b-4 border-r-4 border-amber-400 rounded-br-xl shadow-glow-gold" />
                </div>
              </div>
            )}

            {/* Processing Spinner Overlay */}
            {scanState === 'processing' && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-3 z-30">
                <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-amber-300 font-mono tracking-wider animate-pulse">
                  VERIFYING PASS ON SUPABASE...
                </p>
              </div>
            )}

            {/* Camera Paused Overlay */}
            {!cameraActive && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <CameraOff className="w-10 h-10 text-slate-600" />
                <p className="text-xs font-bold text-slate-300">Camera Feed Paused</p>
                <button
                  type="button"
                  onClick={() => setCameraActive(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 shadow-glow-gold cursor-pointer"
                >
                  Resume Camera
                </button>
              </div>
            )}

            {/* Camera Error Overlay */}
            {cameraError && cameraActive && (
              <div className="absolute inset-0 bg-red-950/95 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center space-y-2.5 z-20">
                <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
                <p className="text-xs font-bold text-red-200 leading-relaxed">{cameraError}</p>
                <p className="text-[10px] text-red-300/80">Check camera browser permissions or enter code manually below.</p>
                <button
                  type="button"
                  onClick={restartCamera}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Release & Restart Camera</span>
                </button>
              </div>
            )}
          </div>

          {/* Viewfinder Footer Strip */}
          <div className="w-full flex items-center justify-between pt-3 px-1 text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{cameraActive ? 'Scanner Live' : 'Camera Off'}</span>
            </div>

            <button
              type="button"
              onClick={toggleCamera}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraActive ? 'Pause Camera' : 'Start Camera'}</span>
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 3. BIG HIGH-CONTRAST STATUS BANNER (FEEDBACK OVERLAY)                   */}
        {/* ======================================================================= */}

        {/* 1. SUCCESS: ENTRY APPROVED & ACCESS GRANTED (GREEN BANNER) */}
        {scanState === 'confirmed' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-emerald-950/90 border-2 border-emerald-500 text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.3)] space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-sm sm:text-base uppercase tracking-wide">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 animate-bounce" />
                <span>ACCESS GRANTED — ADMISSION VERIFIED</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold">
                Reset: {countdown}s
              </span>
            </div>

            {activeBooking && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Primary Visitor:</span>
                  <span className="font-extrabold text-white text-sm">{activeBooking.customer_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Booking Code:</span>
                  <span className="font-mono font-extrabold text-gold-300">#{activeBooking.booking_code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reserved Window:</span>
                  <span className="font-bold text-white">{activeBooking.slot_time} ({formatDateReadable(activeBooking.slot_date)})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-mono text-slate-300">{activeBooking.customer_phone}</span>
                </div>
                {verifiedAtString && (
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20 text-[11px]">
                    <span className="text-slate-400">Verified Timestamp:</span>
                    <span className="font-mono font-bold text-emerald-300">{new Date(verifiedAtString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[11px] text-emerald-300/90">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Slot Checked-In • Verified Entry</span>
              </span>
              <button
                type="button"
                onClick={resetScannerState}
                className="underline hover:text-white font-bold cursor-pointer"
              >
                Scan Next Now
              </button>
            </div>
          </div>
        )}

        {/* 2. REJECTED: TOO EARLY (AMBER BANNER) */}
        {scanState === 'early_arrival' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-amber-950/90 border-2 border-amber-500 text-amber-100 shadow-[0_0_40px_rgba(245,158,11,0.3)] space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-amber-400 font-extrabold text-sm sm:text-base uppercase tracking-wide">
                <Clock className="w-6 h-6 shrink-0 text-amber-400 animate-pulse" />
                <span>TOO EARLY — ENTRY NOT YET VALID</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                Reset: {countdown}s
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2 text-xs text-amber-200">
              <p className="font-bold text-amber-300 text-sm">{statusMessage}</p>
              {activeBooking && (
                <div className="pt-2 border-t border-amber-500/20 space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>Visitor:</span>
                    <span className="font-bold text-white">{activeBooking.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Code:</span>
                    <span className="font-mono text-amber-300 font-bold">#{activeBooking.booking_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled Slot:</span>
                    <span className="font-bold text-white">{activeBooking.slot_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled Date:</span>
                    <span className="font-bold text-white">{formatDateReadable(activeBooking.slot_date)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-amber-300/90">
              <span>⏳ Allowed 15 min prior to slot start time</span>
              <button
                type="button"
                onClick={resetScannerState}
                className="underline hover:text-white font-bold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 3. REJECTED: SLOT EXPIRED (RED BANNER) */}
        {scanState === 'expired' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-rose-950/90 border-2 border-rose-500 text-rose-100 shadow-[0_0_40px_rgba(244,63,94,0.3)] space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-400 font-extrabold text-sm sm:text-base uppercase tracking-wide">
                <Clock className="w-6 h-6 shrink-0 text-rose-400" />
                <span>SLOT EXPIRED — WINDOW CLOSED</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-mono font-bold">
                Reset: {countdown}s
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/30 space-y-2 text-xs text-rose-200">
              <p className="font-bold text-rose-300 text-sm">{statusMessage}</p>
              {activeBooking && (
                <div className="pt-2 border-t border-rose-500/20 space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>Visitor:</span>
                    <span className="font-bold text-white">{activeBooking.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Code:</span>
                    <span className="font-mono text-rose-300 font-bold">#{activeBooking.booking_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expired Slot:</span>
                    <span className="font-bold text-white">{activeBooking.slot_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled Date:</span>
                    <span className="font-bold text-white">{formatDateReadable(activeBooking.slot_date)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-rose-300/90">
              <span>⚠️ Pass expired. Visitor must rebook an active slot.</span>
              <button
                type="button"
                onClick={resetScannerState}
                className="underline hover:text-white font-bold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 4. REJECTED: ALREADY CHECKED IN (RED BANNER) */}
        {scanState === 'completed' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-red-950/90 border-2 border-red-500 text-red-100 shadow-[0_0_40px_rgba(239,68,68,0.3)] space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-red-400 font-extrabold text-sm sm:text-base uppercase tracking-wide">
                <XCircle className="w-6 h-6 shrink-0 text-red-400 animate-pulse" />
                <span>ALREADY CHECKED IN — RE-ENTRY REJECTED</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/40 text-xs font-mono font-bold">
                Reset: {countdown}s
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-red-500/30 space-y-1.5 text-xs text-red-200">
              <p className="font-bold text-red-300">{statusMessage}</p>
              {activeBooking && (
                <div className="pt-2 border-t border-red-500/20 space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>Visitor:</span>
                    <span className="font-bold text-white">{activeBooking.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code:</span>
                    <span className="font-mono text-gold-300">#{activeBooking.booking_code}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-red-300/90">
              <span>Security Alert: Duplicate / Reused Pass</span>
              <button
                type="button"
                onClick={resetScannerState}
                className="underline hover:text-white font-bold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 5. REJECTED: INVALID OR FAKE PASS (RED BANNER) */}
        {scanState === 'invalid' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-red-950/90 border-2 border-red-500 text-red-100 shadow-[0_0_40px_rgba(239,68,68,0.3)] space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-red-400 font-extrabold text-sm sm:text-base uppercase tracking-wide">
                <AlertTriangle className="w-6 h-6 shrink-0 text-red-400" />
                <span>INVALID OR FAKE PASS</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/40 text-xs font-mono font-bold">
                Reset: {countdown}s
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-red-500/30 text-xs text-red-200 space-y-1">
              <p className="font-bold">No verified ticket found matching this code.</p>
              {lastScannedText && (
                <p className="font-mono text-[11px] text-slate-400 truncate">Scanned: {lastScannedText}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-red-300/90">
              <span>Ensure visitor has official Ayyan Fireworks booking pass.</span>
              <button
                type="button"
                onClick={resetScannerState}
                className="underline hover:text-white font-bold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {scanState === 'idle' && (
          <div className="rounded-3xl p-4 bg-slate-900/80 border border-white/10 text-slate-300 space-y-2 text-center">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Ready for Next Pass</span>
            </div>
            <p className="text-xs text-slate-400">
              Hold the visitor’s WhatsApp QR pass inside the scanner box above.
            </p>
          </div>
        )}

        {/* ======================================================================= */}
        {/* 4. QUICK MANUAL CODE INPUT FALLBACK                                     */}
        {/* ======================================================================= */}
        <div className="rounded-3xl p-4 sm:p-5 bg-slate-900/90 border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Manual 6-Digit Code Fallback</span>
            </span>
            <span className="text-[10px] text-slate-500">Screen cracked / Dim?</span>
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. AYN-1042 or 1042"
              className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 uppercase min-h-[46px]"
            />
            <button
              type="submit"
              disabled={isManualVerifying || !manualInput.trim()}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-gold active:scale-95 disabled:opacity-50 min-h-[46px] cursor-pointer shrink-0"
            >
              <span>{isManualVerifying ? 'Checking...' : 'Verify'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ======================================================================= */}
        {/* 5. RECENT SCANS LOG (EXPANDABLE)                                        */}
        {/* ======================================================================= */}
        <div className="rounded-3xl p-4 bg-slate-900/60 border border-white/10 space-y-3">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Recent Shift Scans ({scanHistory.length})</span>
            </div>
            <span className="text-[11px] text-amber-400 underline">
              {showHistory ? 'Hide' : 'View'}
            </span>
          </button>

          {showHistory && (
            <div className="space-y-2 pt-2 border-t border-white/10 max-h-48 overflow-y-auto no-scrollbar">
              {scanHistory.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-3">No scans recorded yet in this session.</p>
              ) : (
                scanHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-white block truncate">
                        {item.customerName || item.bookingCode || item.token}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.timestamp} • {item.slotTime || 'Direct Token'}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                      item.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'early_arrival'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.status === 'expired'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.status === 'completed'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                    }`}>
                      {item.status === 'confirmed' 
                        ? 'Admitted' 
                        : item.status === 'early_arrival'
                        ? 'Too Early'
                        : item.status === 'expired'
                        ? 'Expired'
                        : item.status === 'completed' 
                        ? 'Reused' 
                        : 'Invalid'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GateScannerPage;
