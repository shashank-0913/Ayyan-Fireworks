import React from 'react';
import { PortalAuthGate } from '../portal/PortalAuthGate';
import { ScannerAuthGate } from '../scanner/ScannerAuthGate';

interface RequireOwnerAuthProps {
  children: React.ReactNode;
  type?: 'admin' | 'scanner';
}

export const RequireOwnerAuth: React.FC<RequireOwnerAuthProps> = ({ children, type = 'admin' }) => {
  if (type === 'scanner') {
    return <ScannerAuthGate>{children}</ScannerAuthGate>;
  }
  return <PortalAuthGate>{children}</PortalAuthGate>;
};

export default RequireOwnerAuth;
