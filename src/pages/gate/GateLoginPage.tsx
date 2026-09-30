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
  Sparkles, 
  QrCode 
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { isAuthorizedAdminEmail } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../../components/common/ThemeToggle';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}***@${domain}`;
  return `${user.slice(0, 2)}${'*'.repeat(Math.min(user.length - 3, 5))}${user.slice(-1)}@${domain}`;
}

export const GateLoginPage: React.FC = () => {
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

  // If already logged in with authorized email, redirect directly to /gate
  useEffect(() => {
    if (currentUser && isAuthorizedAdminEmail(currentUser.email)) {
      const from = (location.state as any)?.from?.pathname || '/gate';
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

  // ===========================================================================
  // Step 1: Request OTP Dispatch from Supabase Auth
  // ===========================================================================
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your authorized gate email address.');
      return;
    }

    // 1. Strict Security & Email Restriction (Pre-validation)
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Access Denied: Only authorized gate/admin credentials can log in.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: otpError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: undefined,
        },
      });

      if (otpError) {
        console.error('Supabase OTP send error:', otpError);
        setError(otpError.message);
        return;
      }

      console.log('Supabase Gate OTP dispatched:', data);

      setStep('OTP');
      setOtpDigits(['', '', '', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      setSuccessMsg(`A 6-digit security code has been sent to ${maskEmail(cleanEmail)}`);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      console.error('Supabase Gate OTP exception:', err);
      const msg = err.message || 'Failed to send OTP code. Please check your connection.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================================================================
  // Step 2: Resend OTP Code
  // ===========================================================================
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Access Denied: Only authorized credentials can log in.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: otpError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: undefined,
        },
      });

      if (otpError) {
        console.error('Supabase Gate OTP resend error:', otpError);
        setError(otpError.message);
        return;
      }

      console.log('Supabase Gate OTP re-sent:', data);
      setCountdown(60);
      setCanResend(false);
      setSuccessMsg(`A fresh 6-digit OTP code has been re-sent to ${maskEmail(cleanEmail)}`);
    } catch (err: any) {
      console.error('Supabase Gate OTP resend exception:', err);
      const msg = err.message || 'Failed to resend code.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================================================================
  // Step 2: OTP Input Field Handlers
  // ===========================================================================
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      cleanDigits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(cleanDigits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (error) setError(null);

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // ===========================================================================
  // Step 2: Verify OTP Token
  // ===========================================================================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const enteredOtp = otpDigits.join('').trim();

    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Access Denied: Only authorized gate staff can log in.');
      return;
    }

    if (enteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: enteredOtp.trim(),
        type: 'email',
      });

      if (error) {
        console.error('Supabase Gate OTP verify error:', error);
        setError(error.message);
        return;
      }

      if (data?.session || data?.user) {
        if (data.user && !isAuthorizedAdminEmail(data.user.email)) {
          await supabase.auth.signOut();
          setError('Access Denied: Only authorized credentials can access Gate Verification.');
          return;
        }

        await staffLogin(cleanEmail, 'admin');
        const from = (location.state as any)?.from?.pathname || '/gate';
        navigate(from, { replace: true });
        return;
      }

      await staffLogin(cleanEmail, 'admin');
      navigate('/gate', { replace: true });
    } catch (err: any) {
      console.error('Supabase Gate OTP verify exception:', err);
      const msg = err.message || 'Invalid or expired OTP code. Please check and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-amber-500/30 selection:text-amber-800 dark:selection:text-amber-200 transition-colors duration-300 relative overflow-hidden">
      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Brand Emblem */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 rounded-3xl p-1 border border-amber-500/40 inline-flex items-center justify-center mx-auto shadow-md dark:shadow-glow-gold transform hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center p-2 sm:p-2.5 overflow-hidden">
            <img 
              src="/ayyan-emblem.png" 
              alt="Bunny Brand" 
              className="w-full h-full object-contain filter drop-shadow-sm select-none" 
            />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-2">
            <QrCode className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
            <span>Gate Security Station</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Gate Pass Verification
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Ayyan Fireworks • Visakhapatnam Showroom Entrance
          </p>
        </div>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 py-7 px-5 sm:px-9 rounded-3xl shadow-xl space-y-5 backdrop-blur-xl transition-all">
          
          {/* Security Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Security Protocol: </strong>
              Strict 2-step OTP clearance required to operate the Gate QR scanner.
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCREEN 1: EMAIL ENTRY                                                     */}
          {/* ========================================================================= */}
          {step === 'EMAIL' ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 ease-out">
              <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Authorized Gate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter registered gate staff email"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                    <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 mt-2 min-h-[46px] cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Sending Security Code...' : 'Send Gate OTP Code'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* ========================================================================= */
            /* SCREEN 2: 6-DIGIT OTP ENTRY                                               */
            /* ========================================================================= */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 ease-out">
              <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="truncate pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent Code To</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">{maskEmail(email)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('EMAIL');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{successMsg}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-center">
                    Enter 6-Digit Gate Code
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-inner transition-all transform focus:scale-105"
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                    <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 min-h-[46px] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying with Supabase...' : 'Authorize & Open Gate Scanner'}</span>
                </button>

                <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <span>Didn&apos;t receive code?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend code</span>
                    </button>
                  ) : (
                    <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">
                      Resend in {countdown}s
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Alternative Navigation Links */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-6 px-2">
          <Link
            to="/"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline underline-offset-4"
          >
            ← Public Website
          </Link>

          <Link
            to="/admin/login"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline underline-offset-4"
          >
            Admin Management Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GateLoginPage;
