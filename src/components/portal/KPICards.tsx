import React from 'react';
import { Package, Users, Calendar, TrendingUp } from 'lucide-react';
import { useAyyanStore } from '../../context/AppContext';
import { getFormattedDateOffset } from '../../lib/initialData';

export const KPICards: React.FC = () => {
  const { products, slots, bookings } = useAyyanStore();

  const todayStr = getFormattedDateOffset(0);
  const next7DaysStr = getFormattedDateOffset(7);

  // Metrics calculation
  const activeProducts = products.filter(p => p.is_active).length;
  
  const todayBookings = bookings.filter(b => {
    return b.slot?.slot_date === todayStr || (slots.find(s => s.id === b.slot_id)?.slot_date === todayStr);
  });
  const todayVisitors = todayBookings.reduce((sum, b) => sum + b.visitor_count, 0);

  const upcoming7DayBookings = bookings.filter(b => {
    const sDate = b.slot?.slot_date || slots.find(s => s.id === b.slot_id)?.slot_date || '';
    return sDate >= todayStr && sDate <= next7DaysStr;
  });
  const upcoming7DayVisitors = upcoming7DayBookings.reduce((sum, b) => sum + b.visitor_count, 0);

  // Peak slot calculation
  const todaySlots = slots.filter(s => s.slot_date === todayStr);
  const maxSlot = todaySlots.reduce((prev, curr) => (curr.booked_capacity > (prev?.booked_capacity || 0) ? curr : prev), todaySlots[0]);
  const peakSlotText = maxSlot ? `${maxSlot.start_time.slice(0, 5)} (${maxSlot.booked_capacity}/${maxSlot.total_capacity})` : 'None';

  const cards = [
    {
      title: 'Active Catalogue Items',
      value: activeProducts,
      subtext: `Out of ${products.length} total SKU lines`,
      icon: Package,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      title: "Today's Scheduled Visitors",
      value: `${todayVisitors} Guests`,
      subtext: `${todayBookings.length} confirmed time passes`,
      icon: Users,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Upcoming Bookings (7 Days)',
      value: `${upcoming7DayVisitors} Guests`,
      subtext: `${upcoming7DayBookings.length} total party reservations`,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Peak Slot Occupancy',
      value: peakSlotText,
      subtext: `Today's highest density window`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-2xl bg-slate-900 border ${card.borderColor} shadow-sm space-y-3 transition-transform hover:-translate-y-1 duration-200`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-white tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
