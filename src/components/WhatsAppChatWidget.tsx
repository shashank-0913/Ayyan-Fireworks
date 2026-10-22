import React from 'react';
import { PortalWebsiteQRWidget } from './portal/PortalWebsiteQRWidget';

export const WhatsAppChatWidget: React.FC<React.ComponentProps<typeof PortalWebsiteQRWidget>> = (props) => {
  return <PortalWebsiteQRWidget {...props} />;
};

export { PortalWebsiteQRWidget };
export default WhatsAppChatWidget;
