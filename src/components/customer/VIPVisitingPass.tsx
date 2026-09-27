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
  Download,
  Copy,
  Check,
  Navigation,
  Sparkles,
  ExternalLink,
  Tag,
  BadgePercent
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Booking, Slot } from '../../types';
import { 
  formatDateReadable, 
  formatTime, 
  formatINR,
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

  // Use the unique qr_token or fallback to id
  const qrValue = booking.qr_token || booking.id;

  const calUrl = generateGoogleCalendarUrl(
    slot.slot_date,
    slot.start_time,
    slot.end_time,
    booking.booking_code,
    booking.customer_name
  );

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
    const text = `🎉 Ayyan Fireworks Showroom VIP Entry Pass Confirmed!\n\n🎟️ Booking ID: ${booking.booking_code}\n👤 Customer Name: ${booking.customer_name}\n📞 Phone: +91 ${booking.customer_phone}\n📅 Slot Date: ${formatDateReadable(slot.slot_date)}\n⏰ Slot Window: ${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}\n💵 Amount: ${booking.total_amount ? formatINR(booking.total_amount) : '₹0.00 (Zero-Cost Pass)'}\n\n📍 Showroom: ${SHOWROOM_CONTACT.address}\n🗺️ Google Maps Navigation: ${googleMapsDirectionsUrl}\n\nScan QR Code at Gate to Enter - One-Time Pass`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // High-Resolution Pass PNG Image Exporter
  const handleDownloadPass = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1100;
      canvas.height = 680;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Dark Luxury Obsidian Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1100, 680);
      bgGrad.addColorStop(0, '#0a0a0a');
      bgGrad.addColorStop(0.5, '#121212');
      bgGrad.addColorStop(1, '#080808');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1100, 680);

      // Gold Outer Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, 1060, 640);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(28, 28, 1044, 624);

      // Header Branding
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('AYYAN FIREWORKS  •  BUNNY BRAND SINCE 1987  •  VISAKHAPATNAM', 50, 65);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
      ctx.fillText('AYYAN FIREWORKS SHOWROOM', 50, 105);

      // Top-right Booking Code Box
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fillRect(720, 45, 330, 75);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(720, 45, 330, 75);

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText('OFFICIAL BOOKING ID', 740, 70);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 24px monospace';
      ctx.fillText(booking.booking_code, 740, 104);

      // Divider Line
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 140);
      ctx.lineTo(1050, 140);
      ctx.stroke();

      // Details Columns
      // Row 1
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('📅 SLOT DATE', 50, 180);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(formatDateReadable(slot.slot_date), 50, 210);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('⏰ SLOT WINDOW', 380, 180);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`, 380, 210);

      // Row 2
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('👤 CUSTOMER NAME', 50, 265);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(booking.customer_name, 50, 295);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText(`+91 ${booking.customer_phone}`, 50, 320);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('💵 TOTAL AMOUNT', 380, 265);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(booking.total_amount ? formatINR(booking.total_amount) : '₹0.00 (Zero-Cost Pass)', 380, 295);

      // Address Strip
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('📍 SHOWROOM LOCATION', 50, 370);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillText(SHOWROOM_CONTACT.address, 50, 395);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('✓ PESO Licensed Facility  •  Guaranteed Priority Entry  •  One-Time Pass', 50, 435);

      // Draw QR Code onto Canvas from the SVG element
      const svgElement = document.querySelector('#ticket-qr-svg');
      if (svgElement) {
        const xml = new XMLSerializer().serializeToString(svgElement);
        const svg64 = btoa(unescape(encodeURIComponent(xml)));
        const image64 = 'data:image/svg+xml;base64,' + svg64;
        const qrImg = new Image();
        
        await new Promise((resolve) => {
          qrImg.onload = () => {
            // White card backing for QR
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(740, 175, 290, 310);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.strokeRect(740, 175, 290, 310);

            // Draw QR code centered in the box
            ctx.drawImage(qrImg, 765, 195, 240, 240);

            // Text below QR
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Scan at Gate to Enter', 885, 455);
            ctx.font = '10px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText('ONE-TIME PASS', 885, 472);
            ctx.textAlign = 'start';
            resolve(true);
          };
          qrImg.onerror = () => resolve(false);
          qrImg.src = image64;
        });
      }

      // Bottom Footer with emblem
      const logoImg = new Image();
      logoImg.onload = () => {
        ctx.drawImage(logoImg, 50, 490, 80, 80);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
        ctx.fillText('Ayyan Fireworks (Bunny Brand Since 1987)', 150, 525);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillText(`Visakhapatnam Operations Helpline: ${SHOWROOM_CONTACT.phone}`, 150, 550);

        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Ayyan-Ticket-${booking.booking_code}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          setIsDownloading(false);
        }, 'image/png');
      };

      logoImg.onerror = () => {
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Ayyan-Ticket-${booking.booking_code}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          setIsDownloading(false);
        }, 'image/png');
      };
      logoImg.src = '/ayyan-emblem.png';

    } catch (err) {
      console.error('Error generating ticket image:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Top Success Badge */}
      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 mb-2 shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Showroom Entry Pass Confirmed!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your visiting slot is confirmed. Present the QR code on this ticket to the security scanner at our Visakhapatnam gate for fast-track entry.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* HIGH-END PRINTABLE TICKET CARD: Dark Theme #0a0a0a, borders amber-500/30 */}
      {/* ========================================================================= */}
      <div
        ref={passCardRef}
        className="print-only-pass relative overflow-hidden rounded-3xl bg-[#0a0a0a] text-slate-100 border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        {/* Subtle Ambient Emblem Watermark */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-72 h-72 pointer-events-none opacity-[0.04] select-none">
          <img src="/ayyan-emblem.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-500/30 gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Bunny Brand Official Emblem */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/ayyan-emblem.png"
                alt="Ayyan Fireworks Logo"
                className="w-full h-full object-contain rounded-full bg-black"
                loading="eager"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Bunny Brand Since 1987 • Visakhapatnam Flagship</span>
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                Ayyan Fireworks
              </h3>
              <p className="text-[11px] text-slate-400">
                Official VIP Gate Pass • PESO Licensed Facility
              </p>
            </div>
          </div>

          {/* Booking ID Badge */}
          <div className="flex flex-col items-start sm:items-end bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Booking ID</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                {booking.booking_code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy Booking ID"
                className="p-1 rounded-md text-amber-400 hover:text-amber-200 hover:bg-amber-500/20 transition-colors no-print"
                aria-label="Copy Booking ID"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Ticket Body: Details on Left + QR Code on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b border-amber-500/20 relative z-10 items-center">
          {/* Left Column: Customer & Slot Details (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Customer Name</span>
                </div>
                <p className="text-base font-extrabold text-white truncate">
                  {booking.customer_name}
                </p>
              </div>

              {/* Phone */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Phone Number</span>
                </div>
                <p className="text-base font-mono font-bold text-slate-200">
                  +91 {booking.customer_phone}
                </p>
              </div>

              {/* Slot Date */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Slot Date</span>
                </div>
                <p className="text-base font-extrabold text-white">
                  {formatDateReadable(slot.slot_date)}
                </p>
              </div>

              {/* Slot Window */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Slot Window</span>
                </div>
                <p className="text-base font-extrabold text-white">
                  {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                </p>
              </div>
            </div>

            {/* Amount & Status Bar */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <BadgePercent className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-medium">Total Amount:</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {booking.total_amount ? formatINR(booking.total_amount) : '₹0.00 (Zero-Cost Pass)'}
                </span>
              </div>

              <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>CONFIRMED</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, High-Contrast QR Code Card (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="p-4 bg-white rounded-2xl border-2 border-amber-400 shadow-xl flex flex-col items-center justify-center space-y-2.5 max-w-[220px] w-full text-center">
              <div className="relative">
                <QRCodeSVG
                  id="ticket-qr-svg"
                  value={qrValue}
                  size={160}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="border-t border-slate-200 pt-2 w-full text-center space-y-0.5">
                <p className="text-[11px] font-black text-slate-900 tracking-tight leading-tight">
                  Scan at Gate to Enter
                </p>
                <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">
                  One-Time Pass
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Showroom Address & Navigation Bar */}
        <div className="mt-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-start gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Showroom Address: </strong>
              <span>{SHOWROOM_CONTACT.address}</span>
            </div>
          </div>

          {/* Google Maps Directions Link */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs whitespace-nowrap transition-all no-print"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTION BUTTONS: DOWNLOAD TICKET, PRINT TICKET, WHATSAPP, CALENDAR         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 no-print">
        {/* 1. Download Ticket Button */}
        <button
          onClick={handleDownloadPass}
          disabled={isDownloading}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-60 min-h-[48px]"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Saving Ticket...' : 'Download Ticket'}</span>
        </button>

        {/* 2. Print Ticket Button (window.print()) */}
        <button
          onClick={handlePrint}
          className="py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs min-h-[48px]"
        >
          <Printer className="w-4 h-4 text-amber-500" />
          <span>Print Ticket</span>
        </button>

        {/* 3. Share via WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all text-center shadow-md active:scale-95 min-h-[48px]"
        >
          <Share2 className="w-4 h-4" />
          <span>Share on WhatsApp</span>
        </button>

        {/* 4. Add to Google Calendar */}
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all text-center min-h-[48px]"
        >
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>Add to Calendar</span>
        </a>
      </div>

      {/* Book Another Slot Link */}
      {onBookAnother && (
        <div className="text-center pt-3 no-print">
          <button
            onClick={onBookAnother}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 underline underline-offset-4 font-semibold"
          >
            ← Book another visiting slot
          </button>
        </div>
      )}
    </div>
  );
};
