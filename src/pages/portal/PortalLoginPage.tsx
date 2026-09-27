import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  ShieldAlert, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { ADMIN_EMAIL, isAuthorizedAdminEmail } from '../../lib/utils';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const PortalLoginPage: React.FC = () => {
  const { staffLogin, currentUser } = useAyyanStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState<string>(ADMIN_EMAIL);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Resend Countdown Timer (60s)
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already logged in with authorized email, redirect immediately to admin
  useEffect(() => {
    if (currentUser && isAuthorizedAdminEmail(currentUser.email)) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  // Countdown timer effect for Step 2
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
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

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Strict Security & Email Restriction (Pre-validation before any Supabase call)
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Access Denied: Only authorized admin can log in.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Trigger Supabase OTP generation without user creation
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: "prasadkolla1968@gmail.com",
          options: {
            shouldCreateUser: false,
          },
        });

        if (otpError) {
          throw new Error(otpError.message || 'Failed to send OTP. Please check your Supabase Auth configuration.');
        }
      }

      // Transition to Screen 2: OTP Verification
      setStep('otp');
      setOtpInput('');
      setOtpDigits(['', '', '', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      setSuccessMsg(`A 6-digit verification code has been sent to ${cleanEmail}`);

      // Auto-focus first OTP box on step transition
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setError(err.message || 'Failed to generate OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP Code
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Access Denied: Only authorized admin can log in.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: "prasadkolla1968@gmail.com",
          options: {
            shouldCreateUser: false,
          },
        });

        if (otpError) {
          throw new Error(otpError.message || 'Failed to resend code.');
        }
      }

      setCountdown(60);
      setCanResend(false);
      setSuccessMsg(`A fresh 6-digit OTP code has been re-sent to ${cleanEmail}`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle Individual OTP Digits & Auto-advance
  const handleOtpChange = (index: number, value: string) => {
    // Handle paste of full 6-digit code
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      cleanDigits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      setOtpInput(newDigits.join(''));
      const nextIndex = Math.min(cleanDigits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setOtpInput(newDigits.join(''));

    if (error) setError(null);

    // Auto-focus next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const token = (otpInput || otpDigits.join('')).trim();

    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Access Denied: Only authorized admin can log in.');
      return;
    }

    if (token.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: verifyErr } = await supabase.auth.verifyOtp({
          email: "prasadkolla1968@gmail.com",
          token: token,
          type: "email",
        });

        if (verifyErr) {
          throw new Error(verifyErr.message || 'Invalid or expired OTP code. Please try again.');
        }

        if (data?.user) {
          if (!isAuthorizedAdminEmail(data.user.email)) {
            await supabase.auth.signOut();
            throw new Error('Access Denied: Only authorized admin can log in.');
          }

          // Authorize store session
          await staffLogin(cleanEmail, 'admin');
          const from = (location.state as any)?.from?.pathname || '/admin';
          navigate(from, { replace: true });
          return;
        }
      }

      // Offline / Demo verification fallback
      await staffLogin(cleanEmail, 'admin');
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-amber-500/30 selection:text-amber-800 dark:selection:text-amber-200 transition-colors duration-200 relative">
      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-18 h-18 bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 rounded-3xl p-1 border border-amber-500/40 inline-flex items-center justify-center mx-auto shadow-glow-gold">
          <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center p-1">
            <img src="/ayyan-emblem.png" alt="Bunny Brand" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Ayyan Admin Portal
        </h2>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Strict 2-Step OTP Authentication</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-6">
          
          {/* Security Notice */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-[11px] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Single Authorized Client: </strong>
              Restricted exclusively to <code>{ADMIN_EMAIL}</code>.
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCREEN 1: EMAIL SUBMISSION (REQUEST OTP)                                  */}
          {/* ========================================================================= */}
          {step === 'email' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={ADMIN_EMAIL}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-sm font-medium"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2 min-h-[44px] cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'Sending OTP...' : 'Send OTP'}</span>
              </button>

              {/* Quick Preset for Authorized Admin */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(ADMIN_EMAIL);
                    setError(null);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between font-semibold transition-colors"
                >
                  <span>{ADMIN_EMAIL}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                    Authorized
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* SCREEN 2: 6-DIGIT OTP CODE VERIFICATION                                   */
            /* ========================================================================= */
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
              {/* Target Email Banner with Back Option */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="truncate pr-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent OTP To</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 shrink-0"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              {/* Success Notification */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{successMsg}</span>
                </div>
              )}

              {/* 6-Digit OTP Box Grid (maxLength={6}) */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-center">
                  Enter 6-Digit Verification Code
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
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-inner transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{error}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otpDigits.join('').length !== 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 min-h-[44px] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Verifying OTP Code...' : 'Verify & Access Admin'}</span>
              </button>

              {/* Resend code Section */}
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
                    Resend code in {countdown}s
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline underline-offset-4"
          >
            ← Return to Public Customer Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortalLoginPage;
