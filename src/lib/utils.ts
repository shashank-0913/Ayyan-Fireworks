import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
}

export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export type SlotAvailabilityStatus = 'available' | 'filling_fast' | 'fully_booked' | 'blocked';

export function getSlotStatus(slot: Slot): SlotAvailabilityStatus {
  if (slot.is_blocked) return 'blocked';
  const remaining = slot.total_capacity - slot.booked_capacity;
  if (remaining <= 0) return 'fully_booked';
  if (remaining <= 4) return 'filling_fast';
  return 'available';
}

export function exportToCSV(filename: string, data: Record<string, any>[]) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let val = row[header] === null || row[header] === undefined ? '' : row[header];
        if (typeof val === 'string') {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',')
    )
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateGoogleCalendarUrl(
  dateStr: string,
  startTime: string,
  endTime: string,
  bookingCode: string,
  customerName: string
): string {
  const cleanStart = startTime.split(':').slice(0, 2).join('');
  const cleanEnd = endTime.split(':').slice(0, 2).join('');
  const cleanDate = dateStr.replace(/-/g, '');

  const startIso = `${cleanDate}T${cleanStart}00`;
  const endIso = `${cleanDate}T${cleanEnd}00`;

  const title = encodeURIComponent(`Ayyan Fireworks Showroom VIP Visit (${bookingCode})`);
  const details = encodeURIComponent(
    `Official Showroom VIP Visiting Slot for ${customerName}.\nBooking Ref: ${bookingCode}\n\nStrictly In-Store Viewing & PESO Safety Compliance.\nPlease show this pass at the reception desk upon arrival.`
  );
  const location = encodeURIComponent('Ayyan Fireworks Flagship Showroom, Main Road / NH-16 (near Natayyapalem / Drivers Colony), Sheela Nagar, Visakhapatnam, Andhra Pradesh 530012');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

export const SHOWROOM_CONTACT = {
  brandName: 'Ayyan Fireworks',
  subBrand: 'Bunny Brand Fancy Fireworks',
  since: 'Since 1987',
  phone: '+91 94431 82400',
  whatsapp: '919443182400',
  address: 'Main Road / NH-16 (near Natayyapalem / Drivers Colony), Sheela Nagar, Visakhapatnam, Andhra Pradesh 530012, India.',
  shortAddress: 'NH-16, Sheela Nagar, Visakhapatnam 530012',
  landmark: 'Near Natayyapalem / Drivers Colony, Sheela Nagar',
  city: 'Visakhapatnam, Andhra Pradesh',
  pincode: '530012',
  googleMapsUrl: 'https://maps.google.com/?q=Main+Road+NH-16+Sheela+Nagar+Visakhapatnam+Andhra+Pradesh+530012',
  pesoLicense: 'PESO Licensed Showroom - Class 7, Div 2 Compliant',
  operationalHours: 'Mon - Sun: 09:00 AM – 09:30 PM IST (All 7 Days during Festive Season)'
};

export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = 'Hello Ayyan Fireworks Concierge! I would like to inquire about showroom visiting slots and the 2026 festive catalogue at Visakhapatnam.';
  const message = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${SHOWROOM_CONTACT.whatsapp}?text=${message}`;
}
