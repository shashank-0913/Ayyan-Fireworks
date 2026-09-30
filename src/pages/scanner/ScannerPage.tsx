import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  LogOut, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Search,
  RotateCcw,
  Flashlight,
  ExternalLink,
  History,
  Check
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Booking } from '../../types';
import { formatDateReadable } from '../../lib/utils';
import { ThemeToggle } from '../../components/common/ThemeToggle';

// Synthesized Web Audio Tones (Zero external dependencies)
function playScanTone(type: 'success' | 'error' | 'warning', soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // Crisp 2-tone melodic chime (D5 -> A5)
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
    } else {
      // Double error buzz
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
    // Audio context blocked or not supported
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

export const ScannerPage: React.FC = () => {
  const { verifyGateTicket, staffLogout, updateBookingStatus } = useAyyanStore();
  const navigate = useNavigate();

  // Scanner Hardware State
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [hasTorchSupport, setHasTorchSupport] = useState<boolean>(false);

  // Verification & Modal Result State
  const [scanState, setScanState] = useState<'idle' | 'processing' | 'confirmed' | 'completed' | 'invalid'>('idle');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [verifiedAtString, setVerifiedAtString] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(3);
  const [lastScannedText, setLastScannedText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSignOut = async () => {
    if (window.confirm('Sign out from Gate Pass Verification Station?')) {
      await staffLogout();
      navigate('/scanner/login', { replace: true });
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
        // First-Time Valid & Confirmed: Entry Verified & Slot Closed Permanently!
        setScanState('confirmed');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message || 'Entry Verified & Slot Closed Permanently');
        setVerifiedAtString(result.verified_at || new Date().toISOString());
        playScanTone('success', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        showToast('✓ Verified & Marked Completed');

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
            message: 'Entry Verified & Slot Closed Permanently',
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 29)
        ]);

      } else if (result.status === 'completed') {
        // Re-entry / Already Completed: ALREADY CHECKED IN
        setScanState('completed');
        setActiveBooking(result.booking || null);
        setStatusMessage(result.message || 'ALREADY CHECKED IN');
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
            message: result.message || 'ALREADY CHECKED IN',
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 29)
        ]);

      } else {
        // Invalid or Fake Ticket
        setScanState('invalid');
        setActiveBooking(null);
        setStatusMessage('Invalid or Unrecognized Pass Token!');
        setVerifiedAtString('');
        playScanTone('error', soundEnabled);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        setScanHistory(prev => [
          {
            id: `log-${Date.now()}`,
            token: tokenOrCode,
            status: 'invalid',
            message: 'Invalid or Fake Ticket',
            timestamp: new Date().toLocaleTimeString('en-IN')
          },
          ...prev.slice(0, 29)
        ]);
      }

      // Auto-reset timer (3 seconds)
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
      console.error('Scan processing error:', err);
      setScanState('invalid');
      setStatusMessage('Verification error: ' + (err.message || 'Unknown error'));
      setTimeout(() => resetScannerState(), 3000);
    }
  }, [verifyGateTicket, soundEnabled, resetScannerState]);

  // Quick Action: Manual Mark As Completed / Picked Up
  const handleMarkPickedUp = async () => {
    if (!activeBooking) return;
    const nowIso = new Date().toISOString();
    await updateBookingStatus(activeBooking.id, 'completed');
    setActiveBooking(prev => prev ? { ...prev, status: 'completed', verified_at: nowIso } : null);
    setScanState('confirmed');
    setVerifiedAtString(nowIso);
    showToast('✓ Order / Pass marked as Picked Up & Closed');
  };

  // Manual token input submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setIsManualVerifying(true);
    await processVerification(manualInput.trim());
    setIsManualVerifying(false);
    setManualInput('');
  };

  // Torch / Flashlight Toggle
  const toggleTorch = async () => {
    try {
      if (html5QrCodeRef.current && (html5QrCodeRef.current as any).applyVideoConstraints) {
        const nextState = !torchEnabled;
        await (html5QrCodeRef.current as any).applyVideoConstraints({
          advanced: [{ torch: nextState }]
        });
        setTorchEnabled(nextState);
      }
    } catch (e) {
      console.warn('Torch toggle not supported on this device/browser:', e);
    }
  };

  // Initialize and attach camera stream
  useEffect(() => {
    let isMounted = true;
    const scannerElementId = 'standalone-qr-viewfinder';

    const initScanner = async () => {
      try {
        setCameraError(null);

        // Enumerate video devices
        const devices = await Html5Qrcode.getCameras();
        if (isMounted && devices && devices.length > 0) {
          setAvailableCameras(devices.map(d => ({ id: d.id, label: d.label || `Camera ${d.id.substring(0, 4)}` })));
          if (!selectedCameraId) {
            // Default to rear/back camera
            const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear') || d.label.toLowerCase().includes('environment')) || devices[devices.length - 1];
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
            // Frame parsing loop
          }
        );

        // Check torch support
        try {
          const videoTrack = (html5QrCode as any).videoTrack;
          if (videoTrack && typeof videoTrack.getCapabilities === 'function') {
            const caps = videoTrack.getCapabilities();
            if (caps && caps.torch) {
              setHasTorchSupport(true);
            }
          }
        } catch (e) {}

      } catch (err: any) {
        if (isMounted) {
          console.warn('Camera scanner initialization message:', err);
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
      setTorchEnabled(false);
    } else {
      setCameraActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP COMPACT APP BAR                                                       */}
      {/* ========================================================================= */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Gate Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 p-1 border border-amber-400/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <img src="/ayyan-emblem.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">AYYAN GATE</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Scanner
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Visakhapatnam Floor Station</p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
                soundEnabled
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Chime sound enabled' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* View Admin Desk Button */}
            <Link
              to="/admin/dashboard"
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 min-h-[38px]"
              title="Open Admin Command Center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Desk</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors"
              title="Sign Out of Gate Scanner"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN SCANNER CONTENT AREA                                                 */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 space-y-5">
        
        {/* Viewfinder Card */}
        <div className="relative rounded-3xl overflow-hidden bg-black border border-amber-500/30 shadow-2xl p-4 flex flex-col items-center justify-center">
          
          {/* Target Container for html5-qrcode */}
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            <div id="standalone-qr-viewfinder" className="w-full h-full object-cover" />

            {/* Animated Laser Reticle Overlay */}
            {cameraActive && scanState === 'idle' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                  <div className="w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                </div>

                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce" />

                <div className="flex justify-between">
                  <div className="w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                  <div className="w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
                </div>
              </div>
            )}

            {/* Processing Overlay */}
            {scanState === 'processing' && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-3 z-20">
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
                  Start Camera
                </button>
              </div>
            )}

            {/* Camera Error Message */}
            {cameraError && cameraActive && (
              <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-2 z-10">
                <AlertTriangle className="w-10 h-10 text-red-400" />
                <p className="text-xs font-bold text-red-200">{cameraError}</p>
                <p className="text-[11px] text-red-300/80">Please allow camera permissions or type the pass code below.</p>
              </div>
            )}
          </div>

          {/* Viewfinder Controls Bar (Camera Switcher + Torch + Toggle) */}
          <div className="w-full max-w-sm mt-3.5 flex items-center justify-between gap-2 text-xs">
            {/* Camera Sensor Switch */}
            {availableCameras.length > 1 ? (
              <select
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {availableCameras.map(cam => (
                  <option key={cam.id} value={cam.id}>{cam.label}</option>
                ))}
              </select>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                <span>Rear Lens</span>
              </span>
            )}

            <div className="flex items-center gap-2">
              {/* Torch Toggle (if available) */}
              {hasTorchSupport && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    torchEnabled
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-glow-gold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  title="Toggle Torch / Flashlight"
                >
                  <Flashlight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Toggle Camera On/Off */}
              <button
                type="button"
                onClick={toggleCamera}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  cameraActive
                    ? 'bg-emerald-600/80 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
                <span>{cameraActive ? 'Active' : 'Offline'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VERIFICATION RESULT CARDS                                                 */}
        {/* ========================================================================= */}

        {/* 1. SUCCESS: ENTRY VERIFIED & SLOT CLOSED PERMANENTLY */}
        {scanState === 'confirmed' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-2 border-emerald-500 text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                  <CheckCircle2 className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-slate-950">
                    ADMISSION GRANTED
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-emerald-300 tracking-tight mt-0.5">
                    Entry Verified & Slot Closed Permanently
                  </h2>
                  <p className="text-[11px] text-emerald-200/80 font-mono">
                    Supabase slot marked completed • {verifiedAtString ? new Date(verifiedAtString).toLocaleTimeString('en-IN') : new Date().toLocaleTimeString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-black/40 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300 shrink-0">
                <span>Reset {countdown}s</span>
              </div>
            </div>

            {/* Guest / Order Details */}
            {activeBooking && (
              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Customer Name</span>
                    <p className="text-sm font-extrabold text-white">{activeBooking.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Booking ID</span>
                    <p className="text-sm font-mono font-black text-amber-300">{activeBooking.booking_code}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Phone Number</span>
                    <p className="font-mono text-slate-200">+91 {activeBooking.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Visiting Window</span>
                    <p className="font-bold text-slate-200">{activeBooking.slot_time || '1-Hour Window'}</p>
                  </div>
                </div>

                {activeBooking.slot_date && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span>Date: <strong className="text-white">{formatDateReadable(activeBooking.slot_date)}</strong></span>
                    <span className="text-emerald-400 font-bold">1 VIP Party</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleMarkPickedUp}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Verify & Mark as Picked Up</span>
              </button>
              <button
                type="button"
                onClick={resetScannerState}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Next Scan</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. REJECTED: ALREADY CHECKED IN */}
        {scanState === 'completed' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 border-2 border-red-500 text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-600 text-white">
                    ENTRY REJECTED
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-red-400 tracking-tight mt-0.5">
                    ALREADY CHECKED IN!
                  </h2>
                  <p className="text-[11px] text-red-300 font-mono">
                    {statusMessage}
                  </p>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-black/40 border border-red-400/40 text-[10px] font-mono font-bold text-red-300 shrink-0">
                <span>Reset {countdown}s</span>
              </div>
            </div>

            {activeBooking && (
              <div className="p-3.5 rounded-2xl bg-black/60 border border-red-500/40 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">Customer Name</span>
                    <p className="font-bold text-white">{activeBooking.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">Booking ID</span>
                    <p className="font-mono font-bold text-red-300">{activeBooking.booking_code}</p>
                  </div>
                </div>
                <p className="text-[11px] text-red-300/90 pt-1">
                  ⚠️ This pass has already been used and cannot be reused for entry.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={resetScannerState}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Dismiss & Scan Next</span>
            </button>
          </div>
        )}

        {/* 3. INVALID / UNRECOGNIZED PASS */}
        {scanState === 'invalid' && (
          <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-red-950/90 via-slate-900 to-slate-950 border-2 border-red-600 text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-600 text-white">
                    UNRECOGNIZED
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-red-400 tracking-tight mt-0.5">
                    Invalid or Fake Pass!
                  </h2>
                  <p className="text-[11px] text-red-200 font-mono">
                    No matching booking record found in Supabase database.
                  </p>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-black/40 border border-red-400/40 text-[10px] font-mono font-bold text-red-300 shrink-0">
                <span>Reset {countdown}s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/50 border border-red-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scanned Text / Payload:</span>
              <p className="font-mono text-xs text-red-300 break-all">{lastScannedText || 'No payload'}</p>
            </div>

            <button
              type="button"
              onClick={resetScannerState}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry / Scan Again</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MANUAL FALLBACK CODE ENTRY                                                */}
        {/* ========================================================================= */}
        <form onSubmit={handleManualSubmit} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Manual Pass / Booking ID Lookup</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">AYN-123456</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter booking code or token..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400 min-h-[42px]"
            />
            <button
              type="submit"
              disabled={!manualInput.trim() || isManualVerifying}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-all shadow-md disabled:opacity-50 min-h-[42px]"
            >
              <span>Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* ========================================================================= */}
        {/* SESSION LOG EXPANDER                                                      */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Session Scan Register</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {scanHistory.length} Scans
            </span>
          </div>

          {scanHistory.length > 0 ? (
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    item.status === 'confirmed'
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                      : item.status === 'completed'
                      ? 'bg-red-950/30 border-red-500/30 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs">{item.bookingCode || 'Token'}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {item.status === 'confirmed' ? '✓ Verified' : item.status === 'completed' ? '✗ Re-entry Denied' : '✗ Invalid'}
                      </span>
                    </div>
                    {item.customerName && (
                      <p className="text-[10px] text-slate-300 truncate max-w-[180px]">
                        {item.customerName} {item.customerPhone ? `(+91 ${item.customerPhone})` : ''}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-2">
              Ready for first visitor scan.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 text-center text-[10px] text-slate-500 border-t border-slate-900">
        Ayyan Fireworks • Visakhapatnam Showroom Gate Scanner
      </footer>
    </div>
  );
};
