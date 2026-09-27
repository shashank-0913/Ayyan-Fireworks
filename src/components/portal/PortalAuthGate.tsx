import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAyyanStore } from '../../context/AppContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isAuthorizedAdminEmail } from '../../lib/utils';
import { ShieldAlert } from 'lucide-react';

export const PortalAuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, staffLogout } = useAyyanStore();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAdminAuthorization = async () => {
      try {
        // 1. If Supabase is configured, verify active Supabase auth session
        if (isSupabaseConfigured && supabase) {
          const { data: { user }, error } = await supabase.auth.getUser();

          if (error || !user || !isAuthorizedAdminEmail(user.email)) {
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
        if (!currentUser || !isAuthorizedAdminEmail(currentUser.email)) {
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
        console.warn('Admin authorization gate verification error:', err);
        await staffLogout();
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
      }
    };

    verifyAdminAuthorization();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, currentUser]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-500 animate-pulse">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-300 tracking-wider uppercase">
          Verifying Admin Security Clearance...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
