import React, { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

const WHATSAPP_PHONE = '+91 77299 92125';
const WHATSAPP_PREFILLED_MESSAGE =
  'Hi Ayyan Fireworks, I would like to inquire about crackers and pricing.';
const WHATSAPP_TARGET_URL =
  'https://wa.me/917729992125?text=Hi%20Ayyan%20Fireworks%2C%20I%20would%20like%20to%20inquire%20about%20crackers%20and%20pricing.';
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
  WHATSAPP_TARGET_URL
)}&margin=10`;

interface PortalWhatsAppQRWidgetProps {
  className?: string;
  variant?: 'card' | 'modal' | 'compact';
}

export const PortalWhatsAppQRWidget: React.FC<PortalWhatsAppQRWidgetProps> = ({
  className = '',
  variant = 'card'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(WHATSAPP_TARGET_URL);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = WHATSAPP_TARGET_URL;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div
      id="portal-whatsapp-qr-widget"
      className={`relative rounded-3xl border border-emerald-500/30 dark:border-emerald-500/25 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-slate-900 dark:via-emerald-950/15 dark:to-slate-950 ${
        variant === 'compact' ? 'p-4' : 'p-5 sm:p-6'
      } shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Scannable Real-time QR Code Frame */}
        <div className="relative group shrink-0">
          <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/90 dark:border-white/20 transition-transform duration-200 group-hover:scale-105">
            <img
              src={QR_CODE_URL}
              alt="Ayyan Fireworks WhatsApp QR Code"
              width={160}
              height={160}
              loading="lazy"
              className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-xl block"
            />
          </div>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md border border-emerald-500/40 whitespace-nowrap">
            <QrCode className="w-2.5 h-2.5 text-emerald-400" />
            <span>Showroom Desk QR</span>
          </div>
        </div>

        {/* Info & Admin Desk Actions */}
        <div className="flex-1 text-center md:text-left space-y-3 w-full">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Admin Desk WhatsApp Redirect</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Customer WhatsApp Inquiry Redirect
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Display this verified QR code at the reception/billing counter for visiting customers to scan, or copy the direct inquiry link to share over phone/SMS.
            </p>
          </div>

          {/* Details badge row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-0.5 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{WHATSAPP_PHONE}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 max-w-md truncate">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">"{WHATSAPP_PREFILLED_MESSAGE}"</span>
            </div>
          </div>

          {/* Action Buttons: Copy Link & Open Chat */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              type="button"
              id="admin-whatsapp-copy-link-btn"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 border border-slate-700 min-w-[130px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={WHATSAPP_TARGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="admin-whatsapp-open-chat-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Open Chat</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/90" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalWhatsAppQRWidget;
