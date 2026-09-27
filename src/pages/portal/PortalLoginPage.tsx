import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, KeyRound, ShieldAlert } from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { ADMIN_EMAIL, isAuthorizedAdminEmail } from '../../lib/utils';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const PortalLoginPage: React.FC = () => {
  const { staffLogin, currentUser } = useAyyanStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>(ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('ayyan2026ops');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in with authorized email, redirect immediately
  useEffect(() => {
    if (currentUser && isAuthorizedAdminEmail(currentUser.email)) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Strict Client-Side Email Pre-validation before triggering any Supabase Auth / OTP call
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      setError('Access Denied: You are not authorized to access the Admin Portal.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your passcode or access key.');
      return;
    }

    setIsLoading(true);
    try {
      await staffLogin(cleanEmail, 'admin', password);
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Access Denied: You are not authorized to access the Admin Portal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail(ADMIN_EMAIL);
    setPassword('ayyan2026ops');
    setError(null);
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
        <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
          Authorized Client & Management Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-6">
          {/* Security Notice */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-[11px] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Single-Admin Clearance: </strong>
              Restricted exclusively to authorized administrator (<code>{ADMIN_EMAIL}</code>).
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email */}
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

            {/* Password / Access Passcode */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Passcode / Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
              />
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-2 min-h-[44px] cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Authorization...' : 'Access Admin Portal'}</span>
            </button>
          </form>

          {/* Quick Fill Authorized Admin Profile */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block text-center">
              Authorized Profile
            </span>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-xs text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center justify-between font-semibold"
            >
              <span>{ADMIN_EMAIL}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                Authorized
              </span>
            </button>
          </div>
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
