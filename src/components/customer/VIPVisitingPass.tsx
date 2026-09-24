import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Share2, 
  Printer, 
  ShieldCheck 
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
  const passRef = useRef<HTMLDivElement>(null);

  const calUrl = generateGoogleCalendarUrl(
    slot.slot_date,
    slot.start_time,
    slot.end_time,
    booking.booking_code,
    booking.customer_name
  );

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🎉 Ayyan Fireworks Showroom VIP Pass Confirmed!\n\nBooking ID: ${booking.booking_code}\nName: ${booking.customer_name}\nDate: ${formatDateReadable(slot.slot_date)}\nTime Slot: ${formatTime(slot.start_time)} to ${formatTime(slot.end_time)}\n\nShowroom Address: ${SHOWROOM_CONTACT.address}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Verification Payload for QR
  const qrData = JSON.stringify({
    code: booking.booking_code,
    name: booking.customer_name,
    date: slot.slot_date,
    time: `${slot.start_time}-${slot.end_time}`,
    reservationType: 'Showroom VIP Pass',
    verified: true,
    issuedBy: 'Ayyan Fireworks (Bunny Brand Since 1987) Visakhapatnam'
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 mb-2 shadow-md dark:shadow-glow-gold">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          VIP Showroom Pass Confirmed!
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your visiting reservation is locked in our Visakhapatnam showroom system. Present this digital pass at the reception desk.
        </p>
      </div>

      {/* The Printable VIP Pass Ticket */}
      <div
        ref={passRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/80 via-white to-amber-50/60 dark:from-obsidian-900 dark:via-obsidian-850 dark:to-obsidian-950 border-2 border-amber-400/60 dark:border-gold-500/40 p-6 sm:p-8 shadow-xl dark:shadow-glow-gold-lg backdrop-blur-2xl"
      >
        {/* Background Pass Watermark */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-[0.05] dark:opacity-[0.06] select-none">
          <img src="/ayyan-emblem.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-300/60 dark:border-gold-500/20 gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 rounded-2xl p-0.5 shadow-md border border-amber-400/40 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-0.5">
                <img src="/ayyan-emblem.png" alt="Bunny Brand" className="w-full h-full object-contain rounded-full" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Official Visitor Pass • Bunny Brand Since 1987
              </span>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white tracking-tight">
                AYYAN FIREWORKS SHOWROOM
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Visakhapatnam, Andhra Pradesh</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-amber-500/15 dark:bg-gold-500/10 border border-amber-400/50 dark:border-gold-500/30 px-3.5 py-1.5 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Booking Reference</span>
            <span className="font-mono text-lg font-black text-amber-800 dark:text-gold-300">
              {booking.booking_code}
            </span>
          </div>
        </div>

        {/* Pass Core Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-200 dark:border-white/10">
          {/* Date & Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-gold-400 font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Visiting Date</span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {formatDateReadable(slot.slot_date)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-gold-400 font-semibold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Time Window</span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
            </p>
          </div>

          {/* Visitor Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-gold-400 font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Registered Primary Visitor</span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {booking.customer_name}
            </p>
          </div>
        </div>

        {/* QR Code & Safety Verification Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Priority Consultation Reserved</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
              Please present this verified QR code at the Visakhapatnam showroom reception desk upon arrival.
            </p>
          </div>

          {/* QR Container */}
          <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-white/10 shrink-0">
            <QRCodeSVG
              value={qrData}
              size={110}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Showroom Location Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <MapPin className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-900 dark:text-slate-200">Visakhapatnam Showroom Address: </strong>
            {SHOWROOM_CONTACT.address}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-obsidian-900 hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-400/50 dark:border-gold-500/30 text-amber-700 dark:text-gold-300 hover:text-amber-800 dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all text-center shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Add to Google Calendar</span>
        </a>

        <button
          onClick={handleShareWhatsApp}
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all text-center shadow-md"
        >
          <Share2 className="w-4 h-4" />
          <span>Share via WhatsApp</span>
        </button>

        <button
          onClick={handlePrint}
          className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print Pass</span>
        </button>
      </div>

      {onBookAnother && (
        <div className="text-center pt-4">
          <button
            onClick={onBookAnother}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-gold-300 underline underline-offset-4"
          >
            ← Book another visiting slot
          </button>
        </div>
      )}
    </div>
  );
};
