import React from 'react';
import { PortalWebsiteQRWidget } from './PortalWebsiteQRWidget';

export const PortalWhatsAppQRWidget: React.FC<React.ComponentProps<typeof PortalWebsiteQRWidget>> = (props) => {
  return <PortalWebsiteQRWidget {...props} />;
};

export default PortalWhatsAppQRWidget;
