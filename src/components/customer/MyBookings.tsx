import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Search, 
  Ticket, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Share2, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAyyanStore } from '../../context/AppContext';
import { Booking } from '../../types';
import { formatDateReadable, SHOWROOM_CONTACT, clean10DigitPhone, formatWhatsAppUrl } from '../../lib/utils';
import { VIPVisitingPass } from './VIPVisitingPass';

export default function MyBookings() {
  const { bookings: localBookings } = useAyyanStore();
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);
  const [activePassBooking, setActivePassBooking] = useState<Booking | null>(null);

  const fetchBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = clean10DigitPhone(phone) || phone.trim();
    if (!cleanDigits) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    let foundBookings: any[] = [];
    const phoneWith91 = `91${cleanDigits}`;

    // Query Supabase 'bookings' table directly by phone number
    if (isSupabaseConfigured && supabase) {
      try {
        // Query matching 10-digit clean phone or 91-prefixed phone
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .or(`phone.eq.${cleanDigits},phone.eq.${phoneWith91},customer_phone.eq.${cleanDigits},customer_phone.eq.${phoneWith91}`)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          foundBookings = data;
        } else {
          // Direct fallback .eq('phone', cleanDigits)
          const { data: stdData, error: stdErr } = await supabase
            .from('bookings')
            .select('*')
            .eq('phone', cleanDigits)
            .order('created_at', { ascending: false });

          if (!stdErr && stdData && stdData.length > 0) {
            foundBookings = stdData;
          } else if (stdErr) {
            const { data: idData } = await supabase
              .from('bookings')
              .select('*')
              .eq('phone', cleanDigits)
              .order('id', { ascending: false });

            if (idData && idData.length > 0) {
              foundBookings = idData;
            }
          }
        }
      } catch (err) {
        console.warn('Supabase bookings query exception:', err);
      }
    }

    // Local in-memory / cache fallback
    if (foundBookings.length === 0 && localBookings.length > 0) {
      const rawDigits = cleanDigits.replace(/\D/g, '');
      const localMatches = localBookings.filter(b => {
        const p1 = (b.customer_phone || '').replace(/\D/g, '');
        const p2 = ((b as any).phone || '').replace(/\D/g, '');
        return (
          (b as any).phone === cleanDigits ||
          b.customer_phone === cleanDigits ||
          (rawDigits && (p1.endsWith(rawDigits) || p2.endsWith(rawDigits)))
        );
      });
      if (localMatches.length > 0) {
        foundBookings = localMatches;
      }
    }

    if (foundBookings.length === 0 && !isSupabaseConfigured) {
      setErrorMsg('No bookings found for this phone number.');
    }

    setBookings(foundBookings);
    setLoading(false);
  };

  const handleShareWhatsApp = (booking: any) => {
    const slotDate = booking.slot_date || booking.visit_date || 'Upcoming Date';
    const slotTime = booking.slot_time || booking.time_slot || 'Showroom Window';
    const text = `🎟️ Ayyan Fireworks Showroom VIP Pass\n\n👤 Name: ${booking.customer_name}\n🔑 Pass Code: ${booking.booking_code || booking.id}\n📅 Date: ${slotDate}\n⏰ Time: ${slotTime}\n👥 Visitors: ${booking.visitor_count || 1}\n\n📍 Showroom: ${SHOWROOM_CONTACT.address}\n\nScan QR Code at Gate to Enter!`;
    const targetPhone = booking.phone || booking.customer_phone;
    if (targetPhone) {
      window.open(formatWhatsAppUrl(targetPhone, text), '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 dark:bg-gold-500/10 border border-amber-500/30 text-amber-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider">
          <Ticket className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
          <span>Customer Gate Pass Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
          My Bookings & Passes
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Enter your registered 10-digit mobile number to retrieve your active visiting pass and QR entry token.
        </p>
      </div>
      
      {/* Lookup Form */}
      <form onSubmit={fetchBookings} className="flex flex-col sm:flex-row gap-2.5 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400 font-mono font-bold">+91</span>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            placeholder="Enter 10-digit mobile number (e.g. 7729992125)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm shadow-sm transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !phone.trim()}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-amber-500/20 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Find Pass</span>
            </>
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center font-medium flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Empty Results State */}
      {searched && bookings.length === 0 && !loading && (
        <div className="text-center py-10 px-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No Bookings Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We couldn't find any visiting passes registered under <span className="font-semibold text-slate-700 dark:text-slate-300">"{phone}"</span>.
          </p>
          <div className="pt-2">
            <Link
              to="/book-slot"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition"
            >
              <span>Reserve a Visiting Slot Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Booking Passes List */}
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isConfirmed = (booking.status || 'confirmed').toLowerCase() === 'confirmed';
          const isCompleted = (booking.status || '').toLowerCase() === 'completed' || (booking.status || '').toLowerCase() === 'checked_in';
          const qrPayload = String(booking.id || booking.qr_token || booking.booking_code || '').trim();

          return (
            <div
              key={booking.id}
              className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 hover:border-amber-500/40 transition-all duration-200 relative overflow-hidden group"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500" />

              {/* Pass Details Column */}
              <div className="space-y-3 text-center md:text-left flex-1 w-full">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className={`inline-flex items-center gap-1 text-[11px] uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider ${
                    isConfirmed 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                      : isCompleted
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{booking.status ? booking.status.toUpperCase() : 'CONFIRMED'}</span>
                  </span>

                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {booking.booking_code || booking.id.substring(0, 10)}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {booking.customer_name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Phone: <span className="text-slate-700 dark:text-slate-300 font-medium">+91 {booking.customer_phone || booking.phone}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{formatDateReadable(booking.slot_date || booking.visit_date || '') || 'Scheduled Date'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="truncate">{booking.slot_time || booking.time_slot || 'Showroom Window'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>{booking.visitor_count || 1} Visitor(s)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    ID: {booking.id.substring(0, 12)}...
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActivePassBooking(booking)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Full Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(booking)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* QR Code Pass Box */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md flex flex-col items-center justify-center shrink-0">
                <QRCodeSVG 
                  value={qrPayload} 
                  size={110} 
                  level="M"
                  includeMargin={false}
                />
                <span className="text-[10px] text-slate-600 font-mono mt-1.5 font-bold uppercase tracking-wider">
                  Scan at Gate
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full VIP Pass Modal */}
      {activePassBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-obsidian-900 rounded-3xl p-6 border border-amber-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActivePassBooking(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>

            <VIPVisitingPass
              booking={activePassBooking}
              slot={{
                id: activePassBooking.slot_id || 'slot-1',
                slot_date: activePassBooking.slot_date || activePassBooking.visit_date || '',
                start_time: '10:00',
                end_time: '11:00',
                total_capacity: 15,
                booked_capacity: 1,
                is_blocked: false
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { MyBookings };
