import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Flame, 
  Info 
} from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { Slot, Booking } from '../../types';
import { formatDateReadable, formatTime, getSlotStatus } from '../../lib/utils';
import { VIPVisitingPass } from './VIPVisitingPass';

export const SlotBookingFlow: React.FC = () => {
  const { slots, bookSlot, isEmergencyBlocked } = useAyyanStore();

  // Booking Flow Steps: 1: Select Date, 2: Select Time & Visitors, 3: Guest Details, 4: Confirmed Pass
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [visitorCount, setVisitorCount] = useState<number>(2);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestNotes, setGuestNotes] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{ booking: Booking; slot: Slot } | null>(null);

  // Group slots by date
  const availableDates = useMemo(() => {
    const datesMap = new Map<string, { total: number; available: number }>();
    slots.forEach(s => {
      const existing = datesMap.get(s.slot_date) || { total: 0, available: 0 };
      const rem = s.total_capacity - s.booked_capacity;
      datesMap.set(s.slot_date, {
        total: existing.total + 1,
        available: existing.available + (rem > 0 && !s.is_blocked ? 1 : 0)
      });
    });

    return Array.from(datesMap.keys()).sort().slice(0, 14);
  }, [slots]);

  // Set default selected date
  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Filter slots for chosen date
  const dateSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots
      .filter(s => s.slot_date === selectedDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [slots, selectedDate]);

  const selectedSlot = useMemo(() => {
    return slots.find(s => s.id === selectedSlotId);
  }, [slots, selectedSlotId]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlotId(''); // reset slot selection
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot: Slot) => {
    const rem = slot.total_capacity - slot.booked_capacity;
    if (slot.is_blocked || rem < visitorCount) return;
    setSelectedSlotId(slot.id);
  };

  const handleProceedToDetails = () => {
    if (!selectedSlotId) return;
    setCurrentStep(3);
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
      const res = await bookSlot(selectedSlotId, guestName, cleanPhone, visitorCount, guestNotes);

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to reserve slot. Please try another time.');
        setIsSubmitting(false);
        return;
      }

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#ff4d00', '#ffffff']
      });

      const currentTargetSlot = slots.find(s => s.id === selectedSlotId);
      if (currentTargetSlot && res.booking_code) {
        const dummyBooking: Booking = {
          id: res.booking_id || `book-${Date.now()}`,
          booking_code: res.booking_code,
          slot_id: selectedSlotId,
          customer_name: guestName.trim(),
          customer_phone: cleanPhone,
          visitor_count: visitorCount,
          status: 'confirmed',
          notes: guestNotes,
          created_at: new Date().toISOString()
        };

        setConfirmedBooking({
          booking: dummyBooking,
          slot: currentTargetSlot
        });
        setCurrentStep(4);
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
  if (currentStep === 4 && confirmedBooking) {
    return (
      <VIPVisitingPass
        booking={confirmedBooking.booking}
        slot={confirmedBooking.slot}
        onBookAnother={handleReset}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step Indicator Header */}
      <div className="relative">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {[
            { step: 1, title: 'Visiting Date' },
            { step: 2, title: 'Time & Guests' },
            { step: 3, title: 'Guest Details' },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => {
                    if (item.step < currentStep) setCurrentStep(item.step as 1 | 2 | 3);
                  }}
                  disabled={item.step > currentStep}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-gold-400 to-amber-500 text-obsidian-950 ring-4 ring-gold-500/20 shadow-glow-gold'
                      : isCompleted
                      ? 'bg-emerald-500 text-white cursor-pointer'
                      : 'bg-obsidian-900 border border-white/10 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.step}
                </button>
                <span className={`text-xs mt-2 font-semibold ${isCurrent ? 'text-gold-300' : 'text-slate-400'}`}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar Behind */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-white/10 -z-0" />
      </div>

      {/* Emergency Lockdown Notice */}
      {isEmergencyBlocked && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>
            Visiting reservations are temporarily on hold due to high showroom density. Please contact the concierge directly.
          </span>
        </div>
      )}

      {/* STEP 1: Date Picker */}
      {currentStep === 1 && (
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-gold-400" />
              Step 1: Select Your Preferred Visiting Date
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Showroom visiting slots are open for the next 14 festive days in Sivakasi. Pick a date to view available time windows.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {availableDates.map((dateStr) => {
              const daySlots = slots.filter(s => s.slot_date === dateStr);
              const totalRem = daySlots.reduce((acc, s) => acc + (s.is_blocked ? 0 : s.total_capacity - s.booked_capacity), 0);
              const isSelected = selectedDate === dateStr;

              let badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
              let badgeText = `${totalRem} Available`;

              if (totalRem <= 0) {
                badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
                badgeText = 'Full';
              } else if (totalRem <= 25) {
                badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                badgeText = 'Filling Fast';
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateSelect(dateStr)}
                  className={`p-3.5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-between min-h-[110px] group ${
                    isSelected
                      ? 'bg-gold-500/20 border-gold-400 ring-2 ring-gold-400/30 shadow-glow-gold'
                      : 'bg-obsidian-900/80 border-white/10 hover:border-gold-500/40 hover:bg-white/5'
                  }`}
                >
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider group-hover:text-gold-300">
                    {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  
                  <div className="my-1">
                    <span className="text-xl font-extrabold text-white block">
                      {new Date(dateStr).getDate()}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {badgeText}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Filling Fast
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                Fully Booked
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Time Slot & Guest Count */}
      {currentStep === 2 && (
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                Step 2: Choose Time Window & Number of Visitors
              </h3>
              <p className="text-xs text-slate-300">
                Selected Date: <strong className="text-gold-300">{formatDateReadable(selectedDate)}</strong>
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-slate-400 hover:text-gold-300 flex items-center gap-1 underline underline-offset-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Date</span>
            </button>
          </div>

          {/* Guest Count Selector */}
          <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold-400" />
              Number of Persons Visiting Together
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setVisitorCount(num);
                    if (selectedSlot && (selectedSlot.total_capacity - selectedSlot.booked_capacity) < num) {
                      setSelectedSlotId('');
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    visitorCount === num
                      ? 'bg-gold-500 text-obsidian-950 shadow-glow-gold'
                      : 'bg-obsidian-950 border border-white/10 text-slate-300 hover:border-gold-500/40'
                  }`}
                >
                  {num} {num === 1 ? 'Person' : 'Persons'}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1-Hour Showroom Visiting Windows
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dateSlots.map((slot) => {
                const remaining = slot.total_capacity - slot.booked_capacity;
                const status = getSlotStatus(slot);
                const isSelected = selectedSlotId === slot.id;
                const canAccommodate = !slot.is_blocked && remaining >= visitorCount;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!canAccommodate}
                    onClick={() => handleSlotSelect(slot)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? 'bg-gold-500/20 border-gold-400 ring-2 ring-gold-400/40 shadow-glow-gold'
                        : canAccommodate
                        ? 'bg-obsidian-900/80 border-white/10 hover:border-gold-500/40 hover:bg-white/5'
                        : 'bg-obsidian-950/60 border-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {/* Capacity progress bar */}
                      <div className="w-full bg-obsidian-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'available'
                              ? 'bg-emerald-400'
                              : status === 'filling_fast'
                              ? 'bg-amber-400'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (slot.booked_capacity / slot.total_capacity) * 100)}%`
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {slot.is_blocked ? (
                            <span className="text-red-400 font-semibold">Slot Closed</span>
                          ) : remaining <= 0 ? (
                            <span className="text-slate-500">Fully Booked</span>
                          ) : (
                            <span>{remaining} of {slot.total_capacity} slots left</span>
                          )}
                        </span>

                        <span className={`font-semibold ${
                          status === 'available' ? 'text-emerald-400' :
                          status === 'filling_fast' ? 'text-amber-400' : 'text-slate-500'
                        }`}>
                          {status === 'available' ? 'Available' : status === 'filling_fast' ? 'Filling Fast' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Action */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Back to Date Selection
            </button>

            <button
              onClick={handleProceedToDetails}
              disabled={!selectedSlotId}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                selectedSlotId
                  ? 'gold-gradient-btn'
                  : 'bg-obsidian-900 border border-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Continue to Guest Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Guest Details Form */}
      {currentStep === 3 && (
        <form onSubmit={handleFormSubmit} className="glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-gold-400" />
                Step 3: Primary Visitor Information
              </h3>
              <p className="text-xs text-slate-300">
                A digital VIP pass with QR code will be generated for in-store priority entry.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-slate-400 hover:text-gold-300 flex items-center gap-1 underline underline-offset-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Slot</span>
            </button>
          </div>

          {/* Selected Booking Summary Pill */}
          {selectedSlot && (
            <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-gold-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">Reserved Visiting Window</span>
                  <p className="text-sm font-bold text-white">
                    {formatDateReadable(selectedSlot.slot_date)} • {formatTime(selectedSlot.start_time)} to {formatTime(selectedSlot.end_time)}
                  </p>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-300 font-bold text-xs">
                {visitorCount} {visitorCount === 1 ? 'Person' : 'Persons'}
              </div>
            </div>
          )}

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-400" />
                Full Name of Primary Visitor *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Anand Ramanathan"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                10-Digit Mobile Number (WhatsApp) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm text-slate-400 font-mono">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="9840123456"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-gold-400" />
                Special Requirements or Celebration Inquiries (Optional)
              </label>
              <textarea
                rows={2}
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                placeholder="e.g. Visiting for Diwali family purchase, interested in 120-shot aerial cakes and gift hampers..."
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          {/* Statutory Verification Box */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/10 flex items-start gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Zero-Charge Statutory Reservation: </strong>
              Showroom visiting passes are issued completely free of charge. No payment is collected online. Strictly adherence to PESO showroom capacity limits.
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="gold-gradient-btn px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Locking Visiting Slot...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate VIP Visiting Pass</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
