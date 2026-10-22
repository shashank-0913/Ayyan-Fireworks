import React, { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode, Globe, ShieldCheck, Sparkles } from 'lucide-react';

const WEBSITE_TARGET_URL = 'https://vizagayyan.com';
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
  WEBSITE_TARGET_URL
)}&margin=10`;

interface PortalWebsiteQRWidgetProps {
  className?: string;
  variant?: 'card' | 'modal' | 'compact';
}

export const PortalWebsiteQRWidget: React.FC<PortalWebsiteQRWidgetProps> = ({
  className = '',
  variant = 'card'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(WEBSITE_TARGET_URL);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = WEBSITE_TARGET_URL;
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
      id="portal-website-qr-widget"
      className={`relative rounded-3xl border border-amber-500/30 dark:border-gold-500/25 bg-gradient-to-br from-white via-amber-50/20 to-white dark:from-slate-900 dark:via-amber-950/15 dark:to-slate-950 ${
        variant === 'compact' ? 'p-4' : 'p-5 sm:p-6'
      } shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Scannable Real-time QR Code Frame */}
        <div className="relative group shrink-0">
          <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/90 dark:border-white/20 transition-transform duration-200 group-hover:scale-105">
            <img
              src={QR_CODE_URL}
              alt="vizagayyan.com Website QR Code"
              width={160}
              height={160}
              loading="lazy"
              className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-xl block"
            />
          </div>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md border border-amber-500/40 whitespace-nowrap">
            <QrCode className="w-2.5 h-2.5 text-amber-400" />
            <span>vizagayyan.com</span>
          </div>
        </div>

        {/* Info & Admin Desk Actions */}
        <div className="flex-1 text-center md:text-left space-y-3 w-full">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-gold-300 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
              <span>Website QR Code</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Website QR Code • vizagayyan.com
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Scan this QR code to open vizagayyan.com directly.
            </p>
          </div>

          {/* Details badge row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-0.5 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200">
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
              <span>https://vizagayyan.com</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 dark:bg-gold-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-gold-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Official Visakhapatnam Portal</span>
            </div>
          </div>

          {/* Action Buttons: Copy Link & Open Website */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              type="button"
              id="admin-website-copy-link-btn"
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
              href={WEBSITE_TARGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="admin-open-website-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Globe className="w-4 h-4 text-slate-950" />
              <span>Open Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalWebsiteQRWidget;
