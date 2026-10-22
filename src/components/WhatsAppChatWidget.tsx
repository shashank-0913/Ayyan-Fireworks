import React from 'react';
import { PortalWhatsAppQRWidget } from './portal/PortalWhatsAppQRWidget';

export const WhatsAppChatWidget: React.FC<React.ComponentProps<typeof PortalWhatsAppQRWidget>> = (props) => {
  return <PortalWhatsAppQRWidget {...props} />;
};

export { PortalWhatsAppQRWidget };
export default WhatsAppChatWidget;
