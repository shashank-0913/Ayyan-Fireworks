import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, KeyRound } from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { StaffUser } from '../../types';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const PortalLoginPage: React.FC = () => {
  const { staffLogin, currentUser } = useAyyanStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('manager@ayyanfireworks.com');
  const [password, setPassword] = useState('ayyan2026ops');
  const [role, setRole] = useState<StaffUser['role']>('manager');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (currentUser) {
      const from = (location.state as any)?.from?.pathname || '/portal/dashboard';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please provide valid staff credentials.');
      return;
    }

    setIsLoading(true);
    try {
      await staffLogin(email, role);
      const from = (location.state as any)?.from?.pathname || '/portal/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoRole: StaffUser['role']) => {
    setEmail(demoEmail);
    setPassword('ayyan2026ops');
    setRole(demoRole);
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
          Ayyan Staff & Ops Portal
        </h2>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
          Bunny Brand Since 1987 • Visakhapatnam Showroom Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@ayyanfireworks.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Passcode / Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono"
              />
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Workstation Clearance Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 text-xs font-semibold min-h-[40px]"
              >
                <option value="manager">Showroom Manager (Full Access)</option>
                <option value="admin">Operations Admin</option>
                <option value="floor_staff">Floor Reception & Security Staff</option>
              </select>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-2 min-h-[44px]"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Access Staff Workstation'}</span>
            </button>
          </form>

          {/* Quick Fill Fast Demo Logins */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block text-center">
              Quick Demo Staff Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('manager.selvan@ayyanfireworks.com', 'manager')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-center font-medium min-h-[36px]"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ops.admin@ayyanfireworks.com', 'admin')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-center font-medium min-h-[36px]"
              >
                Ops Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('security.floor@ayyanfireworks.com', 'floor_staff')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-center font-medium min-h-[36px]"
              >
                Floor Staff
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline underline-offset-4"
          >
            ← Return to Public Customer Portal
          </a>
        </div>
      </div>
    </div>
  );
};
