import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Flame, 
  Info,
  CalendarCheck2
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Slot, Booking } from '../../types';
import { formatDateReadable, formatTime, getSlotStatus } from '../../lib/utils';
import { InteractiveCalendar } from '../common/InteractiveCalendar';
import { VIPVisitingPass } from './VIPVisitingPass';

export const SlotBookingFlow: React.FC = () => {
  const { slots, bookSlot, isEmergencyBlocked } = useAyyanStore();

  // Booking Flow Steps:
  // Step 1: Select Date & Time Slot
  // Step 2: Customer Contact Details
  // Step 3 (Confirmed): VIP Visiting Pass
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to today or first available date with slots
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestNotes, setGuestNotes] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{ booking: Booking; slot: Slot } | null>(null);

  // Slots for the chosen date
  const dateSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots
      .filter(s => s.slot_date === selectedDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [slots, selectedDate]);

  const selectedSlot = useMemo(() => {
    return slots.find(s => s.id === selectedSlotId);
  }, [slots, selectedSlotId]);

  // When date changes in calendar, reset active slot
  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlotId('');
    setErrorMessage(null);
  };

  const handleSlotSelect = (slot: Slot) => {
    const rem = slot.total_capacity - slot.booked_capacity;
    if (slot.is_blocked || rem <= 0) return;
    setSelectedSlotId(slot.id);
    setErrorMessage(null);
  };

  const handleProceedToStep2 = () => {
    if (!selectedSlotId) {
      setErrorMessage('Please pick an available visiting time slot.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSlotId) {
      setErrorMessage('Please select a valid time slot.');
      return;
    }

    if (!guestName.trim()) {
      setErrorMessage('Please enter the primary visitor name.');
      return;
    }

    const cleanPhone = guestPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1 booking = 1 slot reservation for family/group (visitor_count = 1)
      const res = await bookSlot(selectedSlotId, guestName, cleanPhone, 1, guestNotes);

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to reserve slot. Please try another time.');
        setIsSubmitting(false);
        return;
      }

      // Confetti Celebration
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#ff4d00', '#ffffff', '#10b981']
      });

      const currentTargetSlot = slots.find(s => s.id === selectedSlotId);
      if (currentTargetSlot && res.booking_code) {
        const dummyBooking: Booking = {
          id: res.booking_id || `book-${Date.now()}`,
          booking_code: res.booking_code,
          slot_id: selectedSlotId,
          customer_name: guestName.trim(),
          customer_phone: cleanPhone,
          visitor_count: 1,
          status: 'confirmed',
          notes: guestNotes,
          created_at: new Date().toISOString()
        };

        setConfirmedBooking({
          booking: dummyBooking,
          slot: currentTargetSlot
        });
        setCurrentStep(3);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedSlotId('');
    setGuestName('');
    setGuestPhone('');
    setGuestNotes('');
    setConfirmedBooking(null);
    setErrorMessage(null);
  };

  // If Booking is confirmed, render VIP Visiting Pass
  if (currentStep === 3 && confirmedBooking) {
    return (
      <VIPVisitingPass
        booking={confirmedBooking.booking}
        slot={confirmedBooking.slot}
        onBookAnother={handleReset}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* 2-Step Mini Indicator */}
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
            currentStep === 1
              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 dark:text-gold-400 flex items-center justify-center text-[11px]">
            1
          </span>
          <span>1. Select Date & Time</span>
        </button>

        <span className="text-slate-300 dark:text-slate-700 font-bold">→</span>

        <button
          type="button"
          disabled={!selectedSlotId && currentStep === 1}
          onClick={() => {
            if (selectedSlotId) setCurrentStep(2);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
            currentStep === 2
              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[11px]">
            2
          </span>
          <span>2. Guest Details</span>
        </button>
      </div>

      {/* Emergency Lockdown Notice */}
      {isEmergencyBlocked && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-500/40 text-red-800 dark:text-red-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <span>
            Visiting reservations are temporarily on hold due to maximum safety threshold. Please contact our concierge directly.
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: Interactive Calendar on Left/Top + Time Slots on Right/Bottom    */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Interactive Calendar (5 cols on Desktop) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarCheck2 className="w-4 h-4" />
                  <span>Choose Visiting Day</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {formatDateReadable(selectedDate)}
                </span>
              </div>

              <InteractiveCalendar
                selectedDate={selectedDate}
                onSelectDate={handleDateChange}
                slots={slots}
              />
            </div>

            {/* Right Column: Time Slots for Selected Date (7 cols on Desktop) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span>Available 1-Hour Visiting Windows</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Showing showroom visiting slots for <strong className="text-slate-900 dark:text-white">{formatDateReadable(selectedDate)}</strong>
                    </p>
                  </div>

                  {selectedSlot && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 shrink-0">
                      Slot Selected
                    </span>
                  )}
                </div>

                {/* Time Slots List */}
                {dateSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                    {dateSlots.map((slot) => {
                      const remaining = slot.total_capacity - slot.booked_capacity;
                      const status = getSlotStatus(slot);
                      const isSelected = selectedSlotId === slot.id;
                      const isAvailable = !slot.is_blocked && remaining > 0;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden min-h-[92px] flex flex-col justify-between active:scale-[0.98] ${
                            isSelected
                              ? 'bg-amber-500/20 dark:bg-amber-500/25 border-amber-500 dark:border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                              : isAvailable
                              ? 'bg-slate-50 hover:bg-amber-50/50 dark:bg-slate-950/80 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                              : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            )}
                          </div>

                          {/* Slot Status Pill */}
                          <div className="pt-2 flex items-center justify-between text-xs">
                            <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-400">
                              {slot.is_blocked ? (
                                <span className="text-red-600 dark:text-red-400 font-bold">Slot Blocked</span>
                              ) : remaining <= 0 ? (
                                <span className="text-slate-500 dark:text-slate-500 font-bold">FULL</span>
                              ) : (
                                <span className="text-slate-700 dark:text-slate-300 font-medium">
                                  {remaining} of {slot.total_capacity} slots left
                                </span>
                              )}
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                slot.is_blocked
                                  ? 'bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300'
                                  : remaining <= 0
                                  ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                  : status === 'available'
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300'
                              }`}
                            >
                              {slot.is_blocked ? 'Closed' : remaining <= 0 ? 'Full' : 'Available'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <Clock className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      No visiting windows configured for this date
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Please pick another date on the calendar.
                    </p>
                  </div>
                )}

                {/* Continue Action */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedSlot ? (
                      <span>Selected: <strong className="text-slate-900 dark:text-white">{formatTime(selectedSlot.start_time)} to {formatTime(selectedSlot.end_time)}</strong></span>
                    ) : (
                      <span>Tap any available time slot above to proceed.</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToStep2}
                    disabled={!selectedSlotId}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[44px] transition-all shadow-md ${
                      selectedSlotId
                        ? 'bg-gradient-to-r from-amber-500 to-gold-400 hover:from-amber-400 hover:to-gold-300 text-slate-950 shadow-glow-gold active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <span>Proceed to Guest Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: Streamlined Customer Details Form                                  */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Step 2: Primary Visitor Details</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A verified digital VIP pass with QR barcode will be generated for fast in-store priority entry.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 py-1 min-h-[36px] underline underline-offset-4 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Slot</span>
            </button>
          </div>

          {/* Selected Booking Summary Banner */}
          {selectedSlot && (
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-slate-950 border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                  Reserved Visiting Window
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  {formatDateReadable(selectedSlot.slot_date)} • {formatTime(selectedSlot.start_time)} to {formatTime(selectedSlot.end_time)}
                </p>
              </div>
            </div>
          )}

          {/* Form Inputs (with text-base on mobile to avoid iOS Safari zoom) */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Full Name of Primary Visitor *</span>
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Anand Ramanathan"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[48px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>10-Digit Mobile Number (WhatsApp) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-base sm:text-sm text-slate-500 dark:text-slate-400 font-mono">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={10}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="9840123456"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-base sm:text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[48px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Special Requirements or Fireworks Inquiries (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                placeholder="e.g. Interested in 120-shot aerial cakes, gift boxes, and daytime sparklers for kids..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-base sm:text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Statutory Zero-Payment Verification Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-200">Zero-Charge Statutory Reservation: </strong>
              Showroom visiting passes are issued completely free of charge. No payment is collected online. Strictly adherence to PESO showroom capacity limits.
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold min-h-[44px]"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-gold-400 hover:from-amber-400 hover:to-gold-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-glow-gold active:scale-95 disabled:opacity-50 min-h-[48px]"
            >
              {isSubmitting ? (
                <span>Locking Visiting Slot...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Slot Reservation</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
