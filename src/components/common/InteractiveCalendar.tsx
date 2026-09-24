import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Slot } from '../../types';

interface InteractiveCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  slots: Slot[];
  className?: string;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  selectedDate,
  onSelectDate,
  slots,
  className = '',
}) => {
  // Current viewing month and year
  const initialDate = useMemo(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date();
  }, [selectedDate]);

  const [viewDate, setViewDate] = useState<Date>(initialDate);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Aggregate slots availability by date (YYYY-MM-DD)
  const slotAvailabilityByDate = useMemo(() => {
    const map = new Map<string, { total: number; available: number; isBlocked: boolean }>();
    slots.forEach(s => {
      const existing = map.get(s.slot_date) || { total: 0, available: 0, isBlocked: false };
      const rem = s.total_capacity - s.booked_capacity;
      const isAvail = !s.is_blocked && rem > 0;
      map.set(s.slot_date, {
        total: existing.total + 1,
        available: existing.available + (isAvail ? rem : 0),
        isBlocked: existing.isBlocked || s.is_blocked
      });
    });
    return map;
  }, [slots]);

  // Days calculations for the viewing month
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Prev month handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Determine if previous month navigation should be disabled (cannot go earlier than current month)
  const isPrevDisabled = useMemo(() => {
    const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return viewDate <= firstOfCurrentMonth;
  }, [viewDate, today]);

  // Generate calendar grid cells
  const calendarCells = useMemo(() => {
    const cells: Array<{
      dayNumber: number;
      dateStr: string;
      isPast: boolean;
      isToday: boolean;
      isSelected: boolean;
      hasSlots: boolean;
      availableCount: number;
      isFullyBooked: boolean;
    }> = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      dateObj.setHours(0, 0, 0, 0);

      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;

      const isPast = dateObj < today;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedDate;

      const slotInfo = slotAvailabilityByDate.get(dateStr);
      const hasSlots = Boolean(slotInfo && slotInfo.total > 0);
      const availableCount = slotInfo?.available || 0;
      const isFullyBooked = hasSlots && availableCount <= 0;

      cells.push({
        dayNumber: day,
        dateStr,
        isPast,
        isToday,
        isSelected,
        hasSlots,
        availableCount,
        isFullyBooked
      });
    }

    return cells;
  }, [year, month, daysInMonth, today, todayStr, selectedDate, slotAvailabilityByDate]);

  const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={`p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 ${className}`}>
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
            {monthName}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200 dark:border-slate-700"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200 dark:border-slate-700"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={`py-1 text-[11px] font-bold uppercase tracking-wider ${
              i === 0 || i === 6 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {/* Padding for empty days before month start */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-10 sm:h-12" />
        ))}

        {/* Month Days */}
        {calendarCells.map((cell) => {
          const {
            dayNumber,
            dateStr,
            isPast,
            isToday,
            isSelected,
            hasSlots,
            availableCount,
            isFullyBooked
          } = cell;

          const isDisabled = isPast;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateStr)}
              className={`h-11 sm:h-12 rounded-2xl flex flex-col items-center justify-center relative transition-all duration-150 min-h-[44px] group ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                  : isDisabled
                  ? 'opacity-25 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : hasSlots
                  ? 'bg-slate-50 hover:bg-amber-50 dark:bg-slate-950/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-900 dark:text-white'
                  : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
              } ${isToday && !isSelected ? 'ring-1 ring-amber-500/50 font-extrabold' : ''}`}
            >
              <span className="text-xs sm:text-sm leading-none">{dayNumber}</span>

              {/* Slot Availability Indicator Dot */}
              {!isPast && hasSlots && (
                <span className="flex items-center gap-0.5 mt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? 'bg-slate-950'
                        : isFullyBooked
                        ? 'bg-red-500'
                        : availableCount > 10
                        ? 'bg-emerald-500 dark:bg-emerald-400'
                        : 'bg-amber-500'
                    }`}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend / Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Open Dates</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Filling Fast</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Full</span>
          </span>
        </div>

        <span className="font-medium text-slate-400 dark:text-slate-500">
          Select date to view windows
        </span>
      </div>
    </div>
  );
};
