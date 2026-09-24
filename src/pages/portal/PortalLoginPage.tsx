import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, KeyRound } from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { StaffUser } from '../../types';

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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-18 h-18 bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 rounded-3xl p-1 border border-amber-500/40 inline-flex items-center justify-center mx-auto shadow-glow-gold">
          <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center p-1">
            <img src="/ayyan-emblem.png" alt="Bunny Brand" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ayyan Staff & Ops Portal
        </h2>
        <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
          Bunny Brand Since 1987 • Visakhapatnam Showroom Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@ayyanfireworks.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Passcode / Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 text-sm font-mono"
              />
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Workstation Clearance Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 text-xs font-semibold"
              >
                <option value="manager">Showroom Manager (Full Access)</option>
                <option value="admin">Operations Admin</option>
                <option value="floor_staff">Floor Reception & Security Staff</option>
              </select>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Access Staff Workstation'}</span>
            </button>
          </form>

          {/* Quick Fill Fast Demo Logins */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block text-center">
              Quick Demo Staff Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('manager.selvan@ayyanfireworks.com', 'manager')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 transition-colors text-center"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ops.admin@ayyanfireworks.com', 'admin')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 transition-colors text-center"
              >
                Ops Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('security.floor@ayyanfireworks.com', 'floor_staff')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 transition-colors text-center"
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
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors underline underline-offset-4"
          >
            ← Return to Public Customer Portal
          </a>
        </div>
      </div>
    </div>
  );
};
