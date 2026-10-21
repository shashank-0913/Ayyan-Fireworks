import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Ticket, 
  Sparkles, 
  CalendarX, 
  BookOpen, 
  Clock, 
  QrCode, 
  Calendar, 
  User, 
  Copy, 
  Check, 
  Share2, 
  ArrowLeft, 
  Plus, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SlotBookingFlow } from './SlotBookingFlow';
import { VIPVisitingPass } from './VIPVisitingPass';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import { SHOWROOM_CONTACT, formatDateReadable, formatWhatsAppUrl } from '../../lib/utils';
import { Booking, Slot } from '../../types';
import { SHOW_SLOT_BOOKING_UI } from '../../config/features';

export interface ReserveSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'new' | 'my-bookings';
}

export interface UserPassItem {
  booking: Booking;
  slot: Slot;
}

const USER_BOOKINGS_STORAGE_KEY = 'ayyan_user_bookings';
const ACTIVE_PASS_STORAGE_KEY = 'ayyan_active_visiting_pass';

/**
 * Normalizes varied localStorage booking records into a standard { booking, slot } object
 */
function normalizeBookingRecord(item: any): UserPassItem | null {
  if (!item) return null;
  const b = item.booking || item;
  if (!b) return null;

  const bookingId = b.id || item.id || `book-${Date.now()}`;
  const bookingCode = b.booking_code || b.ticket_code || item.booking_code || item.ticket_code || `AYN-${String(bookingId).substring(0, 8).toUpperCase()}`;

  const slotData: Slot = item.slot || {
    id: b.slot_id || item.slot_id || 'slot-default',
    slot_date: b.slot_date || item.slot_date || new Date().toISOString().split('T')[0],
    start_time: b.start_time || '08:00:00',
    end_time: b.end_time || '09:00:00',
    total_capacity: 120,
    booked_capacity: 1,
    is_blocked: false,
    created_at: b.created_at || new Date().toISOString()
  };

  const bookingData: Booking = {
    id: bookingId,
    booking_code: bookingCode,
    ticket_code: bookingCode,
    qr_token: b.qr_token || bookingId,
    slot_id: b.slot_id || slotData.id,
    customer_name: b.customer_name || item.customer_name || 'Valued Guest',
    customer_phone: b.customer_phone || b.phone || item.customer_phone || item.phone || '',
    phone: b.phone || b.customer_phone || item.phone || '',
    slot_date: b.slot_date || item.slot_date || slotData.slot_date,
    slot_time: b.slot_time || item.slot_time || '08:00 AM – 09:00 AM',
    total_amount: b.total_amount || 0,
    visitor_count: b.visitor_count || 1,
    status: b.status || item.status || 'confirmed',
    verified_at: b.verified_at || null,
    notes: b.notes || '',
    created_at: b.created_at || item.created_at || new Date().toISOString()
  };

  return {
    booking: bookingData,
    slot: slotData
  };
}

export const ReserveSlotModal: React.FC<ReserveSlotModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'new'
}) => {
  const { vip_booking_enabled, isVipBookingEnabled, isLoading, refreshSettings } = useStoreSettings();
  const effectiveVipEnabled = SHOW_SLOT_BOOKING_UI && (typeof isVipBookingEnabled === 'boolean' ? isVipBookingEnabled : vip_booking_enabled);

  const [activeTab, setActiveTab] = useState<'new' | 'my-bookings'>(defaultTab);
  const [userBookings, setUserBookings] = useState<UserPassItem[]>([]);
  const [selectedPass, setSelectedPass] = useState<UserPassItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load booked tickets from localStorage (ayyan_user_bookings + active pass fallback)
  const loadUserBookings = useCallback(() => {
    try {
      const records: UserPassItem[] = [];
      const seenIds = new Set<string>();

      // 1. Check ayyan_user_bookings list
      const storedList = localStorage.getItem(USER_BOOKINGS_STORAGE_KEY);
      if (storedList) {
        const parsed = JSON.parse(storedList);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            const normalized = normalizeBookingRecord(item);
            if (normalized && normalized.booking.id && !seenIds.has(normalized.booking.id)) {
              seenIds.add(normalized.booking.id);
              records.push(normalized);
            }
          });
        }
      }

      // 2. Fallback to ayyan_active_visiting_pass if not yet added
      const activePassStr = localStorage.getItem(ACTIVE_PASS_STORAGE_KEY);
      if (activePassStr) {
        const parsedActive = JSON.parse(activePassStr);
        const normalized = normalizeBookingRecord(parsedActive);
        if (normalized && normalized.booking.id && !seenIds.has(normalized.booking.id)) {
          seenIds.add(normalized.booking.id);
          records.unshift(normalized);
        }
      }

      setUserBookings(records);
    } catch (e) {
      console.warn('Failed to parse user bookings from localStorage:', e);
    }
  }, []);

  // Sync settings and bookings on open
  useEffect(() => {
    if (isOpen) {
      refreshSettings();
      loadUserBookings();
      setSelectedPass(null);
    }
  }, [isOpen, refreshSettings, loadUserBookings]);

  // Listen for storage / custom updates so newly confirmed bookings appear instantly
  useEffect(() => {
    const handleUpdate = () => loadUserBookings();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ayyan_bookings_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ayyan_bookings_updated', handleUpdate);
    };
  }, [loadUserBookings]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareWhatsApp = (pass: UserPassItem) => {
    const { booking } = pass;
    const customerPhone = booking.customer_phone || (booking as any).phone;
    const text = `🎉 Ayyan Fireworks Showroom VIP Entry Pass Confirmed!\n\n🎟️ Booking ID: ${booking.booking_code}\n👤 Customer Name: ${booking.customer_name}\n📅 Slot Date: ${formatDateReadable(booking.slot_date)}\n⏰ Slot Window: ${booking.slot_time}\n\n📍 Showroom: ${SHOWROOM_CONTACT.address}\n🗺️ Google Maps: ${SHOWROOM_CONTACT.googleMapsUrl}\n\nPresent QR Code at Showroom Gate for priority entry.`;
    
    if (customerPhone) {
      window.open(formatWhatsAppUrl(customerPhone, text), '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  if (!isOpen || !SHOW_SLOT_BOOKING_UI) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Darkened Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 sm:pb-8 overflow-y-auto shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-gold-600 p-0.5 shadow-sm flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-slate-900 dark:text-white text-base sm:text-xl tracking-tight">
                  VIP Showroom Visiting Pass
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-gold-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Free Priority Entry</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Visakhapatnam Flagship Showroom • NH-16 Sheela Nagar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
            aria-label="Close Reservation Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Tab Navigation: "New Booking" vs "My Bookings" */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-obsidian-900 border border-slate-300/60 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('new');
              setSelectedPass(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[42px] ${
              activeTab === 'new'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40 font-extrabold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('my-bookings');
              loadUserBookings();
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[42px] ${
              activeTab === 'my-bookings'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40 font-extrabold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>My Bookings</span>
            {userBookings.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'my-bookings'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-amber-500/20 text-amber-800 dark:text-gold-300 border border-amber-500/30'
              }`}>
                {userBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: NEW BOOKING                                                  */}
        {/* =================================================================== */}
        {activeTab === 'new' && (
          <div>
            {/* If VIP Booking is disabled from Supabase: show polite message */}
            {!isLoading && !effectiveVipEnabled ? (
              <div className="py-6 px-4 space-y-6 text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-md">
                  <CalendarX className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                    Showroom Notice
                  </span>
                  <h3 className="font-display font-black text-slate-900 dark:text-white text-xl sm:text-2xl tracking-tight">
                    VIP Slot Bookings Currently Closed
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Online slot reservations are temporarily closed as per store operations. Visiting passes are not required — customers are warmly welcome for direct in-store selections and purchases during regular showroom hours.
                  </p>
                </div>

                {/* Showroom Timings & Address Details */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-left text-xs space-y-2.5 shadow-xs">
                  <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Showroom Operational Hours:</span>
                  </div>
                  <p className="text-slate-900 dark:text-white font-bold pl-6 text-xs">
                    Regular Hours: 8:00 AM – 10:00 PM
                  </p>
                  <div className="ml-6 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-gold-300 font-bold text-[10px]">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    Special Diwali Season Hours: 5:00 AM – 10:00 PM
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 pl-6 text-[11px] pt-1 border-t border-slate-200/50 dark:border-white/5">
                    📍 {SHOWROOM_CONTACT.shortAddress}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                  {userBookings.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('my-bookings')}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View My Passes ({userBookings.length})</span>
                    </button>
                  )}

                  <Link
                    to="/catalogue"
                    onClick={onClose}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-white/10"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Explore Catalogue</span>
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* If VIP Booking is enabled: allow user to fill out and submit booking form */
              <div className="animate-in fade-in duration-200">
                <SlotBookingFlow />
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: MY BOOKINGS                                                  */}
        {/* =================================================================== */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* If user clicked to view a single full pass */}
            {selectedPass ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedPass(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-gold-300 hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Passes</span>
                  </button>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Pass #{selectedPass.booking.booking_code}
                  </span>
                </div>

                <VIPVisitingPass
                  booking={selectedPass.booking}
                  slot={selectedPass.slot}
                  onBookAnother={() => {
                    setSelectedPass(null);
                    setActiveTab('new');
                  }}
                />
              </div>
            ) : (
              /* List of Pass Cards */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-amber-500" />
                      <span>Passes Saved on this Device</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Present any QR code at the showroom gate scanner for touchless admission.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className="self-start sm:self-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-gold-300 font-bold text-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Make New Booking</span>
                  </button>
                </div>

                {userBookings.length === 0 ? (
                  /* Empty state */
                  <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                      <Ticket className="w-7 h-7" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        No Bookings Found on this Device
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        You have not reserved a visiting pass on this device yet, or browser storage was cleared.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('new')}
                        className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Reserve a New VIP Slot</span>
                      </button>

                      <Link
                        to="/my-bookings"
                        onClick={onClose}
                        className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-white/10 transition"
                      >
                        <span>Search by Mobile Number</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Pass Cards Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userBookings.map((passItem) => {
                      const { booking } = passItem;
                      const qrValue = String(booking.id || booking.qr_token || booking.booking_code || '').trim();
                      const isCopied = copiedCode === booking.booking_code;

                      return (
                        <div
                          key={booking.id}
                          className="relative p-5 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 shadow-sm hover:border-amber-500/40 transition-all space-y-4"
                        >
                          {/* Card Header: Pass Code & Status */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-obsidian-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                                  <span>{booking.booking_code}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCode(booking.booking_code)}
                                    className="text-slate-400 hover:text-amber-500 transition"
                                    title="Copy Pass Code"
                                  >
                                    {isCopied ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </span>

                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Confirmed</span>
                                </span>
                              </div>

                              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{booking.customer_name}</span>
                                {booking.customer_phone && (
                                  <span className="text-slate-400 text-[11px] font-mono">
                                    • +91 {booking.customer_phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Date & Time Slot Details with QR Code */}
                          <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200/80 dark:border-white/5">
                            <div className="space-y-2 text-xs flex-1">
                              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                                    Visiting Date
                                  </span>
                                  <strong className="text-slate-900 dark:text-white font-bold text-xs">
                                    {formatDateReadable(booking.slot_date)}
                                  </strong>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                                    Time Slot
                                  </span>
                                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                    {booking.slot_time}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            {/* Crisp QR Code */}
                            <div className="flex flex-col items-center shrink-0">
                              <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                                <QRCodeSVG
                                  value={qrValue}
                                  size={85}
                                  level="M"
                                  includeMargin={false}
                                />
                              </div>
                              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-1">
                                Gate QR
                              </span>
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedPass(passItem)}
                              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              <span>View Full Pass</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleShareWhatsApp(passItem)}
                              className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                              title="Share Pass on WhatsApp"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ReserveSlotModal;
