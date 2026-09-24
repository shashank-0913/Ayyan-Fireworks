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
  Sparkles, 
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
    booking.customer_name,
    booking.visitor_count
  );

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🎉 Ayyan Fireworks Showroom VIP Pass Confirmed!\n\nBooking ID: ${booking.booking_code}\nName: ${booking.customer_name}\nDate: ${formatDateReadable(slot.slot_date)}\nTime Slot: ${formatTime(slot.start_time)} to ${formatTime(slot.end_time)}\nGuests: ${booking.visitor_count} Persons\n\nShowroom Address: ${SHOWROOM_CONTACT.address}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Verification Payload for QR
  const qrData = JSON.stringify({
    code: booking.booking_code,
    name: booking.customer_name,
    date: slot.slot_date,
    time: `${slot.start_time}-${slot.end_time}`,
    visitors: booking.visitor_count,
    verified: true,
    issuedBy: 'Ayyan Fireworks Sivakasi'
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-2 shadow-glow-gold">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          VIP Showroom Pass Confirmed!
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Your visiting reservation is locked in our Sivakasi operations system. Present this digital pass at the showroom reception.
        </p>
      </div>

      {/* The Printable VIP Pass Ticket */}
      <div
        ref={passRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-obsidian-900 via-obsidian-850 to-obsidian-950 border-2 border-gold-500/40 p-6 sm:p-8 shadow-glow-gold-lg backdrop-blur-2xl"
      >
        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gold-500/20 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-glow-gold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400">
                Official Visitor Pass
              </span>
              <h3 className="font-display font-black text-xl text-white tracking-tight">
                AYYAN FIREWORKS SHOWROOM
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right bg-gold-500/10 border border-gold-500/30 px-3.5 py-1.5 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Booking Reference</span>
            <span className="font-mono text-lg font-black text-gold-300">
              {booking.booking_code}
            </span>
          </div>
        </div>

        {/* Pass Core Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-white/10">
          {/* Date & Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Visiting Date</span>
            </div>
            <p className="text-base font-bold text-white">
              {formatDateReadable(slot.slot_date)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Time Window</span>
            </div>
            <p className="text-base font-bold text-white">
              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
            </p>
          </div>

          {/* Visitors */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Guest Allocation</span>
            </div>
            <p className="text-base font-bold text-white">
              {booking.visitor_count} {booking.visitor_count === 1 ? 'Person' : 'Persons (Family)'}
            </p>
          </div>
        </div>

        {/* Guest & QR Section */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10">
          <div className="space-y-3 flex-1">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Primary Guest Name</span>
              <span className="text-lg font-bold text-white">{booking.customer_name}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Registered Mobile</span>
              <span className="font-mono text-sm text-slate-300">+91 {booking.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PESO Fast-Track Security Verification</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0">
            <QRCodeSVG
              value={qrData}
              size={120}
              level="H"
              includeMargin={false}
              fgColor="#090b10"
              bgColor="#ffffff"
            />
            <span className="text-[10px] font-mono font-bold text-obsidian-950 mt-1">SCAN AT GATE</span>
          </div>
        </div>

        {/* Location & Directions */}
        <div className="pt-5 flex items-start gap-3 text-xs text-slate-400">
          <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Showroom Address: </strong>
            {SHOWROOM_CONTACT.address}
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Valet parking available. Please arrive 10 minutes prior to your time window.
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-gold"
        >
          <Calendar className="w-4 h-4" />
          <span>Add to Google Calendar</span>
        </a>

        <button
          onClick={handleShareWhatsApp}
          className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>Share Pass on WhatsApp</span>
        </button>

        <button
          onClick={handlePrint}
          className="py-3 px-4 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-white/10 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4 text-gold-400" />
          <span>Print / Save Pass</span>
        </button>
      </div>

      {/* Book Another Option */}
      {onBookAnother && (
        <div className="text-center pt-2">
          <button
            onClick={onBookAnother}
            className="text-xs text-slate-400 hover:text-gold-300 transition-colors underline underline-offset-4"
          >
            Need to book an additional slot for friends or family?
          </button>
        </div>
      )}
    </div>
  );
};
