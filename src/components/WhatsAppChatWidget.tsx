import React from 'react';
import { ExternalLink, QrCode, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './common/WhatsAppIcon';

interface WhatsAppChatWidgetProps {
  className?: string;
  variant?: 'card' | 'compact' | 'footer';
}

const WHATSAPP_PHONE = '+91 77299 92125';
const WHATSAPP_DIRECT_URL =
  'https://wa.me/917729992125?text=Hi%20Ayyan%20Fireworks%2C%20I%20would%20like%20to%20inquire%20about%20crackers%20and%20pricing.';
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
  WHATSAPP_DIRECT_URL
)}&margin=10`;

export const WhatsAppChatWidget: React.FC<WhatsAppChatWidgetProps> = ({
  className = '',
  variant = 'card'
}) => {
  return (
    <div
      id="whatsapp-chat-widget"
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        variant === 'footer'
          ? 'bg-white/90 dark:bg-obsidian-900/90 border-slate-200 dark:border-white/10 p-5 shadow-sm'
          : 'bg-white dark:bg-obsidian-900 border-emerald-500/30 dark:border-emerald-500/30 p-6 shadow-md dark:shadow-glow-gold'
      } ${className}`}
    >
      {/* Decorative emerald ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* Scannable Real-time QR Code Frame */}
        <div className="relative group shrink-0">
          <div className="p-2.5 bg-white rounded-xl shadow-md border border-slate-200/80 dark:border-white/20 transition-transform duration-200 group-hover:scale-105">
            <img
              src={QR_CODE_URL}
              alt="Scan to Chat on WhatsApp with Ayyan Fireworks"
              width={140}
              height={140}
              loading="lazy"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-lg block"
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow whitespace-nowrap">
            <QrCode className="w-2.5 h-2.5 text-emerald-400" />
            <span>Scan Camera</span>
          </div>
        </div>

        {/* Info & Direct CTA */}
        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Verified WhatsApp Support</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              Instant Cracker Inquiry &amp; Pricing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Scan the QR code with your phone camera or connect directly to receive catalog quotes, availability, and bulk pricing.
            </p>
          </div>

          <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
            Helpline: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{WHATSAPP_PHONE}</span>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <a
              href={WHATSAPP_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-chat-direct-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Open WhatsApp Chat Directly</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/90" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatWidget;
