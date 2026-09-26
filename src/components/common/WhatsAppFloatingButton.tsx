import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_CONTACT } from '../../lib/utils';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <aside
      aria-label="WhatsApp Instant Chat"
      className="fixed bottom-[84px] right-4 sm:bottom-6 sm:right-6 md:bottom-6 md:right-6 z-[9999] flex items-center justify-center mb-safe"
    >
      <a
        href={WHATSAPP_CONTACT.url}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="relative group w-[60px] h-[60px] min-w-[60px] min-h-[60px] rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 select-none"
        aria-label="Chat with Ayyan Fireworks on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Subtle Ambient Pulse Wave */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none group-hover:opacity-0 transition-opacity"
          aria-hidden="true"
        />

        {/* Desktop Hover Tooltip */}
        <span
          className="hidden md:flex items-center gap-2 absolute right-[72px] top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-slate-900/95 dark:bg-black/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0"
          aria-hidden="true"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          Chat on WhatsApp
        </span>

        {/* Crisp WhatsApp Icon */}
        <WhatsAppIcon className="w-8 h-8 text-white filter drop-shadow-sm transition-transform duration-300 group-hover:rotate-6" />
      </a>
    </aside>
  );
};

export default WhatsAppFloatingButton;
