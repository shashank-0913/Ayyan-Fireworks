import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  KeyRound, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  QrCode, 
  UserCog
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { OWNER_EMAIL, isAuthorizedOwnerEmail } from '../../lib/utils';
import { useAyyanStore } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface OwnerAuthPortalProps {
  defaultPortal?: 'admin' | 'scanner';
}

export const OwnerAuthPortal: React.FC<OwnerAuthPortalProps> = ({ defaultPortal = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, staffLogin } = useAyyanStore();

  // Determine which portal is being requested (/admin or /scanner)
  const isScanner = location.pathname.includes('scanner') || defaultPortal === 'scanner';
  const portalTitle = isScanner ? 'Gate Scanner Terminal' : 'Ayyan Admin Portal';

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Target owner email from utils or configured environment
  const targetOwnerEmail = OWNER_EMAIL || 'ayyanfireworks@gmail.com';

  // If already logged in, redirect automatically to destination
  React.useEffect(() => {
    if (currentUser && isAuthorizedOwnerEmail(currentUser.email)) {
      const destination = (location.state as any)?.from?.pathname || (isScanner ? '/scanner/terminal' : '/admin/dashboard');
      navigate(destination, { replace: true });
    }
  }, [currentUser, isScanner, navigate, location]);

  // Step 1: Send OTP to Owner Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();

    // Check authorization against configured owner/admin emails
    if (!isAuthorizedOwnerEmail(cleanEmail) && cleanEmail !== targetOwnerEmail.toLowerCase()) {
      setError(`Access denied: Only the authorized owner email (${targetOwnerEmail}) is permitted.`);
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error: sendError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true,
          }
        });

        if (sendError) throw sendError;
      }

      setSuccessMsg(`Secure 6-digit verification OTP sent to ${cleanEmail}`);
      setStep('OTP');
    } catch (err: any) {
      console.error('OTP Send Error:', err);
      setError(err?.message || 'Failed to dispatch OTP. Please check your Supabase Auth configuration or retry.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Grant Access
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanOtp,
          type: 'email',
        });

        if (verifyError) throw verifyError;
      }

      // Sync user session to app store
      await staffLogin(cleanEmail, 'admin');

      // Route directly to the intended destination upon success
      const destination = (location.state as any)?.from?.pathname || (isScanner ? '/scanner/terminal' : '/admin/dashboard');
      navigate(destination, { replace: true });
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      setError(err?.message || 'Invalid or expired 6-digit OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-obsidian-950 flex flex-col items-center justify-center p-4 relative transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 rounded-2xl p-0.5 mx-auto shadow-lg dark:shadow-glow-gold flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center p-1 overflow-hidden">
            <img 
              src="/ayyan-emblem.png" 
              alt="Ayyan Fireworks Bunny Brand" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mt-4 tracking-tight">
          {portalTitle}
        </h1>
        <p className="text-xs tracking-wider text-amber-600 dark:text-amber-400 font-bold uppercase mt-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>Strict 2-Step OTP Authentication</span>
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white dark:bg-obsidian-900 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl">
        <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-400/20 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
            <strong>Authorized Portal Access:</strong> Restricted exclusively to authorized store management personnel and designated gate operators.
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-5 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 mb-5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'EMAIL' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Owner Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter registered owner email"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-amber-500/25 transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send OTP</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Enter 6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('EMAIL')}
                  className="text-xs text-amber-600 dark:text-gold-400 hover:underline font-semibold"
                >
                  Change Email
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="••••••"
                className="w-full text-center tracking-[0.5em] text-xl font-mono font-black px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                OTP sent to <strong className="text-slate-700 dark:text-slate-200">{email}</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-emerald-600/25 transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access {isScanner ? 'Scanner Terminal' : 'Dashboard'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Alternate Quick Links */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-col items-center gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            {isScanner ? (
              <Link 
                to="/admin/login" 
                className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
              >
                <UserCog className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Login</span>
              </Link>
            ) : (
              <Link 
                to="/scanner/login" 
                className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                <span>Gate Scanner Login</span>
              </Link>
            )}
          </div>

          <Link 
            to="/" 
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:underline flex items-center gap-1.5 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Customer Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerAuthPortal;
