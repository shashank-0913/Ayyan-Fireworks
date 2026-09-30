import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAyyanStore } from '../../context/AppContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isAuthorizedOwnerEmail } from '../../lib/utils';
import { QrCode } from 'lucide-react';

export const ScannerAuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, staffLogout } = useAyyanStore();
  const location = useLocation();
  const hasValidSession = Boolean(currentUser && isAuthorizedOwnerEmail(currentUser.email));
  const [isVerifying, setIsVerifying] = useState<boolean>(!hasValidSession);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(hasValidSession);

  useEffect(() => {
    let isMounted = true;

    const verifyScannerAuthorization = async () => {
      try {
        // 1. If Supabase is configured, verify active Supabase auth session
        if (isSupabaseConfigured && supabase) {
          const { data: { user }, error } = await supabase.auth.getUser();

          if (error || !user || !isAuthorizedOwnerEmail(user.email)) {
            if (user) {
              await supabase.auth.signOut();
            }
            await staffLogout();
            if (isMounted) {
              setIsAuthorized(false);
              setIsVerifying(false);
            }
            return;
          }

          // Authorized Supabase session
          if (isMounted) {
            setIsAuthorized(true);
            setIsVerifying(false);
          }
          return;
        }

        // 2. Local store session verification
        if (!currentUser || !isAuthorizedOwnerEmail(currentUser.email)) {
          await staffLogout();
          if (isMounted) {
            setIsAuthorized(false);
            setIsVerifying(false);
          }
          return;
        }

        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
      } catch (err) {
        console.warn('Scanner authorization verification error:', err);
        await staffLogout();
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
      }
    };

    verifyScannerAuthorization();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, currentUser]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-500 shadow-glow-gold animate-pulse">
          <QrCode className="w-7 h-7" />
        </div>
        <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-300 tracking-wider uppercase">
          Verifying Owner Clearance...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/scanner/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
