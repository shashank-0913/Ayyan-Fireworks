import React, { useRef, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  CheckCircle2, 
  Share2, 
  Printer, 
  ShieldCheck, 
  Download,
  Copy,
  Check,
  Navigation,
  Sparkles,
  ExternalLink,
  Award,
  Lock
} from 'lucide-react';
import { Booking, Slot } from '../../types';
import { 
  formatDateReadable, 
  formatTime, 
  generateGoogleCalendarUrl, 
  SHOWROOM_CONTACT 
} from '../../lib/utils';

interface VIPVisitingPassProps {
  booking: Booking;
  slot: Slot;
  onBookAnother?: () => void;
}

export const VIPVisitingPass: React.FC<VIPVisitingPassProps> = ({ booking, slot, onBookAnother }) => {
  const passCardRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const calUrl = generateGoogleCalendarUrl(
    slot.slot_date,
    slot.start_time,
    slot.end_time,
    booking.booking_code,
    booking.customer_name
  );

  // Exact Google Maps location link provided by user
  const googleMapsDirectionsUrl = SHOWROOM_CONTACT.googleMapsUrl;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.booking_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🎉 Ayyan Fireworks Showroom VIP Pass Confirmed!\n\n🎟️ Unique Pass Code: ${booking.booking_code}\n👤 Visitor Name: ${booking.customer_name}\n📞 Mobile: +91 ${booking.customer_phone}\n📅 Date: ${formatDateReadable(slot.slot_date)}\n⏰ Time Window: ${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}\n\n📍 Showroom Address: ${SHOWROOM_CONTACT.address}\n🗺️ Google Maps Navigation: ${googleMapsDirectionsUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Client-side HTML5 Canvas Pass Image Generator (Clean QR-Free Design)
  const handleDownloadPass = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background Gradient (Luxury Obsidian & Warm Amber)
      const bgGrad = ctx.createLinearGradient(0, 0, 1000, 600);
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(0.5, '#121722');
      bgGrad.addColorStop(1, '#080a0f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1000, 600);

      // Gold Outer Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 968, 568);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(24, 24, 952, 552);

      // 2. Header Strip
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('OFFICIAL VIP VISITING PASS  •  BUNNY BRAND SINCE 1987  •  VISAKHAPATNAM', 50, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
      ctx.fillText('AYYAN FIREWORKS SHOWROOM', 50, 100);

      // Top-right Pass Code Box
      ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.fillRect(660, 42, 290, 72);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(660, 42, 290, 72);

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText('UNIQUE VIP PASS ID', 680, 65);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 24px monospace';
      ctx.fillText(booking.booking_code, 680, 98);

      // Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 135);
      ctx.lineTo(950, 135);
      ctx.stroke();

      // 3. Middle Core Details (3 Columns)
      // Col 1: Date
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('📅 VISITING DATE', 50, 180);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(formatDateReadable(slot.slot_date), 50, 215);

      // Col 2: Slot Time
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('⏰ 1-HOUR TIME WINDOW', 360, 180);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`, 360, 215);

      // Col 3: Primary Visitor
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('👤 REGISTERED VISITOR', 680, 180);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(booking.customer_name, 680, 215);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText(`+91 ${booking.customer_phone}`, 680, 242);

      // Divider
      ctx.beginPath();
      ctx.moveTo(50, 275);
      ctx.lineTo(950, 275);
      ctx.stroke();

      // 4. Showroom & Navigation Details
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('📍 SHOWROOM ADDRESS & NAVIGATION', 50, 315);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.fillText(SHOWROOM_CONTACT.address, 50, 345);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('Google Maps: https://maps.app.goo.gl/agWQFufKjWkwFbVs7', 50, 375);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('✓ PESO Licensed Facility  •  Zero Online Payment Required  •  Guaranteed Priority Entry', 50, 405);

      // 5. Draw Bunny Brand Logo at bottom left
      const logoImg = new Image();
      logoImg.onload = () => {
        ctx.drawImage(logoImg, 50, 440, 90, 90);
        
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('Ayyan Fireworks (Bunny Brand Since 1987) Visakhapatnam Showroom', 160, 475);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.fillText(`Helpline: ${SHOWROOM_CONTACT.phone}  |  Show this pass code at reception upon arrival`, 160, 500);

        // Export to PNG & trigger download
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = `Ayyan-VIP-Pass-${booking.booking_code}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
          setIsDownloading(false);
        }, 'image/png');
      };
      logoImg.onerror = () => {
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = `Ayyan-VIP-Pass-${booking.booking_code}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
          setIsDownloading(false);
        }, 'image/png');
      };
      logoImg.src = '/ayyan-emblem.png';

    } catch (err) {
      console.error('Error generating pass image:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Success Badge */}
      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 mb-2 shadow-md dark:shadow-glow-gold">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          VIP Showroom Pass Confirmed!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your visiting reservation is locked in our Visakhapatnam showroom system. Show your unique Pass ID at the reception desk.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* THE PRINT & SCREENSHOT-FRIENDLY VIP PASS CARD (CLEAN QR-FREE)             */}
      {/* ========================================================================= */}
      <div
        ref={passCardRef}
        className="print-only-pass relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/70 dark:from-obsidian-900 dark:via-obsidian-850 dark:to-obsidian-950 border-2 border-amber-400 dark:border-gold-500/50 p-6 sm:p-8 shadow-xl dark:shadow-glow-gold-lg backdrop-blur-2xl"
      >
        {/* Subtle Ambient Emblem Watermark */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-64 h-64 pointer-events-none opacity-[0.06] dark:opacity-[0.05] select-none">
          <img src="/ayyan-emblem.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-300/60 dark:border-gold-500/25 gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Bunny Brand Official Clean Circular Logo */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/ayyan-emblem.png"
                alt="Bunny Brand Fancy Fireworks"
                className="w-full h-full object-contain rounded-full bg-black"
                loading="eager"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-gold-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Official VIP Visiting Pass • Bunny Brand Since 1987</span>
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                AYYAN FIREWORKS SHOWROOM
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Visakhapatnam Flagship Facility • PESO Certified
              </p>
            </div>
          </div>

          {/* Prominent Unique Pass Code Badge */}
          <div className="flex flex-col items-start sm:items-end bg-amber-500/15 dark:bg-gold-500/15 border border-amber-400/70 dark:border-gold-500/50 px-4 py-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-gold-300 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Unique Pass Code</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-900 dark:text-gold-200 tracking-wider">
                {booking.booking_code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy Pass Code"
                className="p-1 rounded-md text-amber-700 hover:text-amber-900 dark:text-gold-400 dark:hover:text-gold-200 hover:bg-amber-500/20 transition-colors no-print"
                aria-label="Copy Pass Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Pass Core Details: Date, Slot Time, Visitor Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-6 border-b border-slate-200/80 dark:border-white/10 relative z-10">
          {/* Date */}
          <div className="space-y-1 p-3.5 rounded-2xl bg-amber-500/5 dark:bg-white/[0.02] border border-amber-500/20 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-gold-400 font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-gold-400" />
              <span>Visiting Date</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatDateReadable(slot.slot_date)}
            </p>
          </div>

          {/* Slot Time */}
          <div className="space-y-1 p-3.5 rounded-2xl bg-amber-500/5 dark:bg-white/[0.02] border border-amber-500/20 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-gold-400 font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-600 dark:text-gold-400" />
              <span>Slot Time</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
            </p>
          </div>

          {/* Visitor Name & Phone */}
          <div className="space-y-1 p-3.5 rounded-2xl bg-amber-500/5 dark:bg-white/[0.02] border border-amber-500/20 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-gold-400 font-bold uppercase tracking-wider">
              <User className="w-4 h-4 text-amber-600 dark:text-gold-400" />
              <span>Customer Name</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white truncate">
              {booking.customer_name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+91 {booking.customer_phone}</span>
            </p>
          </div>
        </div>

        {/* Security & Verification Banner (QR-Free Clean VIP Strip) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                <span>PESO Verified Showroom Reservation</span>
                <Award className="w-3.5 h-3.5 text-amber-500" />
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Present your Unique Pass Code <strong className="text-amber-800 dark:text-gold-300 font-mono">{booking.booking_code}</strong> at the reception desk upon arrival.
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold shrink-0 shadow-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AUTHENTICATED PASS</span>
          </div>
        </div>

        {/* Showroom Address & Google Maps Navigation Link */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Showroom Address: </strong>
                <span>{SHOWROOM_CONTACT.address}</span>
              </div>
            </div>

            {/* Direct Google Maps Directions Action Button */}
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 dark:bg-gold-500/20 dark:hover:bg-gold-500/30 border border-amber-500/40 dark:border-gold-500/40 text-amber-900 dark:text-gold-200 font-bold text-xs whitespace-nowrap transition-all shadow-xs hover:shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
              <span>Navigate via Google Maps</span>
              <ExternalLink className="w-3 h-3 text-amber-600 dark:text-gold-400" />
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTION BUTTONS: DOWNLOAD PASS, CALENDAR, WHATSAPP, PRINT                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 no-print">
        {/* 1. Download Pass / Save to Phone Button */}
        <button
          onClick={handleDownloadPass}
          disabled={isDownloading}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md dark:shadow-glow-gold active:scale-95 disabled:opacity-60 min-h-[48px]"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Saving Pass...' : 'Download Pass / Save'}</span>
        </button>

        {/* 2. 1-Click Add to Google Calendar */}
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 px-4 rounded-2xl bg-white dark:bg-obsidian-900 hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-400/50 dark:border-gold-500/30 text-amber-700 dark:text-gold-300 hover:text-amber-800 dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all text-center shadow-xs min-h-[48px]"
        >
          <Calendar className="w-4 h-4 text-amber-600 dark:text-gold-400" />
          <span>Add to Google Calendar</span>
        </a>

        {/* 3. Share via WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all text-center shadow-md active:scale-95 min-h-[48px]"
        >
          <Share2 className="w-4 h-4" />
          <span>Share on WhatsApp</span>
        </button>

        {/* 4. Print / PDF Pass */}
        <button
          onClick={handlePrint}
          className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all min-h-[48px]"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Book Another Slot Link */}
      {onBookAnother && (
        <div className="text-center pt-3 no-print">
          <button
            onClick={onBookAnother}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-gold-300 underline underline-offset-4 font-semibold"
          >
            ← Book another visiting slot
          </button>
        </div>
      )}
    </div>
  );
};
