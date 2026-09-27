import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  CameraOff, 
  ScanLine, 
  History, 
  Search, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Booking } from '../../types';
import { formatDateReadable } from '../../lib/utils';

// Synthesized Audio Feedback Helper (Zero external audio file dependencies)
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
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Deep reject buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(100, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // AudioContext blocked or not supported
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
  status: 'confirmed' | 'completed' | 'invalid';
  message: string;
  timestamp: string;
}

export const PortalScannerPage: React.FC = () => {
  const { verifyGateTicket } = useAyyanStore();

  // Scanner Hardware State
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Verification Result State
  const [scanState, setScanState] = useState<'idle' | 'processing' | 'confirmed' | 'completed' | 'invalid'>('idle');
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

  // Refs
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const resetTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  // Handle Scan Verification Core Logic
  const processVerification = useCallback(async (tokenOrCode: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setScanState('processing');
    setLastScannedText(tokenOrCode);

    try {
      const result = await verifyGateTicket(tokenOrCode);

      if (result.status === 'confirmed') {
        // d. Found and confirmed: Entry Verified & Slot Closed!
        setScanState('confirmed');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message || 'Entry Verified & Slot Closed!');
        setVerifiedAtString(result.verified_at || new Date().toISOString());
        playScanTone('success', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // Add to history
        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            bookingCode: result.booking?.booking_code,
            customerName: result.booking?.customer_name,
            customerPhone: result.booking?.customer_phone,
            slotTime: result.booking?.slot_time,
            slotDate: result.booking?.slot_date,
            status: 'confirmed',
            message: 'Entry Verified & Slot Closed',
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 24)
        ]);

      } else if (result.status === 'completed') {
        // c. Found and already completed: RE-ENTRY REJECTED
        setScanState('completed');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message);
        setVerifiedAtString(result.verified_at || '');
        playScanTone('error', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([250]);

        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            bookingCode: result.booking?.booking_code,
            customerName: result.booking?.customer_name,
            customerPhone: result.booking?.customer_phone,
            slotTime: result.booking?.slot_time,
            slotDate: result.booking?.slot_date,
            status: 'completed',
            message: result.message,
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 24)
        ]);

      } else {
        // b. Not found: Invalid or Fake Ticket!
        setScanState('invalid');
        setActiveBooking(null);
        setStatusMessage('Invalid or Fake Ticket!');
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
          ...prev.slice(0, 24)
        ]);
      }

      // e. Reset camera scanner after 3-second delay
      setCountdown(3);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

      let timeLeft = 3;
      countdownIntervalRef.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdownIntervalRef.current);
        }
      }, 1000);

      resetTimerRef.current = setTimeout(() => {
        resetScannerState();
      }, 3000);

    } catch (err: any) {
      console.error('Verification error:', err);
      setScanState('invalid');
      setStatusMessage('Verification Error: ' + (err.message || 'Unknown network error'));
      setTimeout(() => resetScannerState(), 3000);
    }
  }, [verifyGateTicket, soundEnabled]);

  // Immediate Reset to ready state
  const resetScannerState = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setScanState('idle');
    setActiveBooking(null);
    setStatusMessage('');
    isProcessingRef.current = false;
  };

  // Manual token verify submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setIsManualVerifying(true);
    await processVerification(manualInput.trim());
    setIsManualVerifying(false);
    setManualInput('');
  };

  // Initialize and attach camera stream
  useEffect(() => {
    let isMounted = true;
    const scannerElementId = 'gate-qr-viewfinder';

    const initScanner = async () => {
      try {
        setCameraError(null);

        // Get available camera video devices
        const devices = await Html5Qrcode.getCameras();
        if (isMounted && devices && devices.length > 0) {
          setAvailableCameras(devices.map(d => ({ id: d.id, label: d.label || `Camera ${d.id.substring(0, 4)}` })));
          if (!selectedCameraId) {
            // Default to back camera or last device
            const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')) || devices[devices.length - 1];
            setSelectedCameraId(backCam.id);
          }
        }

        if (!cameraActive) return;

        // Clean up previous instance
        if (html5QrCodeRef.current) {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
          html5QrCodeRef.current.clear();
        }

        const html5QrCode = new Html5Qrcode(scannerElementId);
        html5QrCodeRef.current = html5QrCode;

        const config: Html5QrcodeCameraScanConfig = {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edgeSize = Math.floor(minEdge * 0.72);
            return { width: edgeSize, height: edgeSize };
          },
          aspectRatio: 1.0,
        };

        const cameraIdOrConfig = selectedCameraId ? { deviceId: { exact: selectedCameraId } } : { facingMode: 'environment' };

        await html5QrCode.start(
          cameraIdOrConfig,
          config,
          (decodedText) => {
            if (isMounted && !isProcessingRef.current) {
              processVerification(decodedText);
            }
          },
          () => {
            // Ignored frame parsing noise
          }
        );
      } catch (err: any) {
        if (isMounted) {
          console.warn('Camera initiation notice:', err);
          setCameraError(err.message || 'Camera permission denied or camera device busy.');
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
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(() => {}).finally(() => {
            html5QrCodeRef.current?.clear();
          });
        } else {
          html5QrCodeRef.current.clear();
        }
      }
    };
  }, [cameraActive, selectedCameraId, processVerification]);

  const toggleCamera = async () => {
    if (cameraActive) {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      }
      setCameraActive(false);
    } else {
      setCameraActive(true);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Gate Access Controller</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Visakhapatnam Flagship
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            <span>VIP Gate Pass Scanner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Live camera QR barcode reader & instant Supabase concurrency-locked admission check.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[40px] ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Audio Chime Enabled' : 'Audio Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* Toggle Camera Button */}
          <button
            type="button"
            onClick={toggleCamera}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all min-h-[40px] ${
              cameraActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span>{cameraActive ? 'Camera Live' : 'Enable Camera'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN LAYOUT: SCANNER VIEWFINDER (LEFT) + STATUS & DETAILS (RIGHT)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Live QR Viewfinder & Camera Select (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-amber-500/30 shadow-2xl p-4 sm:p-5 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px]">
            {/* Viewfinder Target Container for html5-qrcode */}
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <div id="gate-qr-viewfinder" className="w-full h-full object-cover" />

              {/* Animated Laser Beam / Scanning Guide Overlay */}
              {cameraActive && scanState === 'idle' && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                  {/* 4 Corner Crosshairs */}
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                    <div className="w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                  </div>

                  {/* Animated Sweeping Laser Line */}
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce" />

                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                    <div className="w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
                  </div>
                </div>
              )}

              {/* Processing Overlay */}
              {scanState === 'processing' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-3 z-20">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-amber-300 font-mono tracking-wider animate-pulse">
                    VERIFYING TICKET CONCURRENCY...
                  </p>
                </div>
              )}

              {/* Camera Offline Warning */}
              {!cameraActive && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <CameraOff className="w-12 h-12 text-slate-600" />
                  <p className="text-sm font-bold text-slate-300">Camera Feed Paused</p>
                  <button
                    onClick={() => setCameraActive(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-md"
                  >
                    Start Scanner
                  </button>
                </div>
              )}

              {/* Camera Error Message */}
              {cameraError && cameraActive && (
                <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                  <p className="text-xs font-bold text-red-200">{cameraError}</p>
                  <p className="text-[11px] text-red-300/80">Please grant camera permissions in your browser settings or use manual code entry below.</p>
                </div>
              )}
            </div>

            {/* Camera Switcher Dropdown */}
            {availableCameras.length > 1 && (
              <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Camera className="w-3.5 h-3.5 text-amber-500" />
                  <span>Switch Sensor:</span>
                </span>
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {availableCameras.map(cam => (
                    <option key={cam.id} value={cam.id}>{cam.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Manual Input Fallback Form */}
          <form onSubmit={handleManualSubmit} className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Manual Token / Pass Code Lookup</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">AYN-123456 or UUID</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter QR token or Booking ID..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
              />
              <button
                type="submit"
                disabled={!manualInput.trim() || isManualVerifying}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 min-h-[44px]"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Result Cards & Detailed Gate Verdict (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* ========================================================================= */}
          {/* 1. STATE: SUCCESS / ENTRY VERIFIED & SLOT CLOSED                          */}
          {/* ========================================================================= */}
          {scanState === 'confirmed' && (
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950 border-2 border-emerald-500 text-white shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                    <CheckCircle2 className="w-9 h-9 animate-bounce" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-slate-950">
                      ENTRY PERMITTED
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-emerald-300 tracking-tight mt-1">
                      Entry Verified & Slot Closed!
                    </h2>
                    <p className="text-xs text-emerald-200/80 font-mono">
                      Supabase slot marked completed • Verified at {verifiedAtString ? new Date(verifiedAtString).toLocaleTimeString('en-IN') : new Date().toLocaleTimeString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Auto-Reset Pill */}
                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-400/40 text-[11px] font-mono font-bold text-emerald-300 text-center shrink-0">
                  <span>Next in {countdown}s</span>
                </div>
              </div>

              {/* Guest Details Card */}
              {activeBooking && (
                <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Customer Name</span>
                      <p className="text-base font-extrabold text-white">{activeBooking.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Booking ID</span>
                      <p className="text-base font-mono font-black text-amber-300">{activeBooking.booking_code}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Phone Number</span>
                      <p className="font-mono text-slate-200">+91 {activeBooking.customer_phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Booked Window</span>
                      <p className="font-bold text-slate-200">{activeBooking.slot_time || '1-Hour Slot'}</p>
                    </div>
                  </div>

                  {activeBooking.slot_date && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <span>Visiting Date: <strong className="text-white">{formatDateReadable(activeBooking.slot_date)}</strong></span>
                      <span className="text-emerald-400 font-bold">1 VIP Party</span>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={resetScannerState}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ready for Next Guest (Scan Now)</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. STATE: RE-ENTRY REJECTED (ALREADY COMPLETED)                            */}
          {/* ========================================================================= */}
          {scanState === 'completed' && (
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 border-2 border-red-500 text-white shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                    <ShieldAlert className="w-9 h-9 text-red-500" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-600 text-white">
                      ENTRY DENIED
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-red-400 tracking-tight mt-1">
                      RE-ENTRY REJECTED!
                    </h2>
                    <p className="text-xs text-red-300 font-mono">
                      {statusMessage}
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-red-400/40 text-[11px] font-mono font-bold text-red-300 text-center shrink-0">
                  <span>Reset {countdown}s</span>
                </div>
              </div>

              {activeBooking && (
                <div className="p-4 rounded-2xl bg-black/60 border border-red-500/40 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">Customer Name</span>
                      <p className="text-sm font-bold text-white">{activeBooking.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">Booking ID</span>
                      <p className="text-sm font-mono font-bold text-red-300">{activeBooking.booking_code}</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200">
                    ⚠️ This one-time ticket has already been used and cannot be reused for gate entry.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={resetScannerState}
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Dismiss & Scan Next</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. STATE: INVALID OR FAKE TICKET                                         */}
          {/* ========================================================================= */}
          {scanState === 'invalid' && (
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-red-950/90 via-slate-900 to-slate-950 border-2 border-red-600 text-white shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                    <XCircle className="w-9 h-9 text-red-400" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-600 text-white">
                      UNRECOGNIZED
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-red-400 tracking-tight mt-1">
                      Invalid or Fake Ticket!
                    </h2>
                    <p className="text-xs text-red-200 font-mono">
                      No matching booking record found in Supabase database.
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-red-400/40 text-[11px] font-mono font-bold text-red-300 text-center shrink-0">
                  <span>Reset {countdown}s</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-red-500/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scanned Text / Payload:</span>
                <p className="font-mono text-xs text-red-300 bg-red-950/60 p-2.5 rounded-xl border border-red-900/60 break-all">
                  {lastScannedText || 'No QR payload detected'}
                </p>
              </div>

              <button
                type="button"
                onClick={resetScannerState}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry / Scan Again</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. STATE: IDLE / STANDBY AWAITING SCANS                                  */}
          {/* ========================================================================= */}
          {scanState === 'idle' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <ScanLine className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Gate Scanner Active & Ready
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Align the visitor's printed or mobile QR pass inside the viewfinder.
                  </p>
                </div>
              </div>

              {/* Security Quick Guidelines */}
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>One-Time Verification:</strong> A pass immediately updates to 'completed' status upon first scan.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Zero Offline Duplicate Entry:</strong> Concurrency protected via Supabase database rows.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Fallback:</strong> Use manual lookup box below camera if the visitor's phone screen is cracked.</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* RECENT SCAN AUDIT LOG (SESSION REGISTER)                                   */}
          {/* ========================================================================= */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Session Scan Log</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {scanHistory.length} Scans This Session
              </span>
            </div>

            {scanHistory.length > 0 ? (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {scanHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                      item.status === 'confirmed'
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                        : item.status === 'completed'
                        ? 'bg-red-50/60 dark:bg-red-950/30 border-red-300 dark:border-red-500/30 text-red-900 dark:text-red-200'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs">{item.bookingCode || 'Unknown ID'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {item.status === 'confirmed' ? '✓ Verified' : item.status === 'completed' ? '✗ Re-entry Rejected' : '✗ Invalid'}
                        </span>
                      </div>
                      {item.customerName && (
                        <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                          {item.customerName} {item.customerPhone ? `(+91 ${item.customerPhone})` : ''}
                        </p>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No scan events recorded yet in this active session.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
