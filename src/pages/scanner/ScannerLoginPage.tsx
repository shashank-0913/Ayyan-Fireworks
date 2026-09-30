import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  ShieldAlert, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  QrCode,
  Lock
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { isAuthorizedOwnerEmail, OWNER_EMAIL } from '../../lib/utils';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ThemeToggle } from '../../components/common/ThemeToggle';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}***@${domain}`;
  return `${user.slice(0, 2)}${'*'.repeat(Math.min(user.length - 3, 5))}${user.slice(-1)}@${domain}`;
}

export const ScannerLoginPage: React.FC = () => {
  const { staffLogin, currentUser } = useAyyanStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Resend Countdown Timer (60s)
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already logged in with authorized owner email, redirect directly to /scanner
  useEffect(() => {
    if (currentUser && isAuthorizedOwnerEmail(currentUser.email)) {
      const from = (location.state as any)?.from?.pathname || '/scanner';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  // Countdown timer effect for OTP screen
  useEffect(() => {
    let timer: any;
    if (step === 'OTP' && countdown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Step 1: Request OTP Dispatch from Supabase Auth
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your authorized owner email address.');
      return;
    }

    // Strict Pre-validation: Reject any email that is not the configured owner
    if (!isAuthorizedOwnerEmail(cleanEmail)) {
      setError(`Access Denied: Only the authorized owner email (${OWNER_EMAIL}) is permitted to access the Gate QR Scanner.`);
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: false,
          },
        });

        if (otpError) {
          console.error('Supabase OTP send error:', otpError);
          // If error occurs with shouldCreateUser: false, provide friendly guidance
          setError(otpError.message || 'Unable to send security OTP. Please check your network or try again.');
          setIsLoading(false);
          return;
        }
      }

      setStep('OTP');
      setOtpDigits(['', '', '', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      setSuccessMsg(`A 6-digit security OTP code has been dispatched to ${maskEmail(cleanEmail)}.`);

      // Focus first OTP field after transition
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      console.error('OTP request exception:', err);
      setError(err.message || 'Network error while requesting verification OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle Individual Digit Inputs
  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are typed
    if (char && index === 5 && newDigits.every(d => d !== '')) {
      const fullCode = newDigits.join('');
      executeVerifyOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const splitDigits = pastedData.split('');
    setOtpDigits(splitDigits);
    otpInputRefs.current[5]?.focus();
    executeVerifyOtp(pastedData);
  };

  // Step 3: Execute OTP Code Verification with Supabase Auth
  const executeVerifyOtp = async (code: string) => {
    if (code.length !== 6) return;
    setError(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: code,
          type: 'email'
        });

        if (verifyError) {
          console.error('Supabase OTP verification error:', verifyError);
          setError(verifyError.message || 'Invalid or expired 6-digit OTP code. Please check your email and try again.');
          setIsLoading(false);
          return;
        }

        if (data?.user && !isAuthorizedOwnerEmail(data.user.email)) {
          await supabase.auth.signOut();
          setError(`Access Denied: Only ${OWNER_EMAIL} is authorized.`);
          setIsLoading(false);
          return;
        }

        // Successfully verified via Supabase Auth
        await staffLogin(cleanEmail, 'admin');
      } else {
        // Fallback local auth mock
        await staffLogin(cleanEmail, 'admin');
      }

      setSuccessMsg('Security verified! Opening Gate Scanner...');
      setTimeout(() => {
        const destination = (location.state as any)?.from?.pathname || '/scanner';
        navigate(destination, { replace: true });
      }, 500);
    } catch (err: any) {
      console.error('OTP verification exception:', err);
      setError(err.message || 'Verification failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }
    executeVerifyOtp(fullCode);
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: { shouldCreateUser: false },
        });
      }
      setCountdown(60);
      setCanResend(false);
      setSuccessMsg(`A fresh 6-digit OTP code has been resent to ${maskEmail(cleanEmail)}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="p-4 sm:p-6 flex items-center justify-between z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Public Catalogue</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
          
          {/* Brand Emblem & Scanner Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-1 shadow-lg mx-auto flex items-center justify-center border border-amber-300/40">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <div className="pt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Authorized Gate Station
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                Ayyan QR Scanner
              </h1>
              <p className="text-xs text-slate-400">
                Owner OTP clearance for VIP visitor verification & order redemption.
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{successMsg}</div>
            </div>
          )}

          {/* STEP 1: Email Form */}
          {step === 'EMAIL' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Owner Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter owner email (e.g. prasadkolla1968@gmail.com)"
                    required
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Strictly restricted to designated owner: <strong className="text-amber-400/90">{OWNER_EMAIL}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-[46px]"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Dispatching Security OTP...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 6-Digit OTP Form */}
          {step === 'OTP' && (
            <form onSubmit={handleManualVerifySubmit} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Enter 6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('EMAIL');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Change Email
                  </button>
                </div>

                {/* 6 Digit Box Grid */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className="w-full aspect-square text-center font-mono text-xl font-bold bg-slate-950 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:bg-slate-900 transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpDigits.some(d => d === '')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-[46px]"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify & Unlock Scanner</span>
                  </>
                )}
              </button>

              {/* Resend Action */}
              <div className="text-center pt-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">
                    Resend code in <span className="font-mono font-bold text-slate-200">{countdown}s</span>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Bottom Security Notice */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-amber-500/70" />
            <span>Supabase Concurrency Secured • Visakhapatnam</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-400">
        Ayyan Fireworks • Bunny Brand Since 1987
      </footer>
    </div>
  );
};
