import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAyyanStore } from '../../context/AppContext';

export const PortalAuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAyyanStore();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
