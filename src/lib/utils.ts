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
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
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

export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const str = timeStr.trim();
  
  // Check 12-hour format with AM/PM (e.g. "04:00 PM" or "4:30 pm")
  const match12 = str.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|am|pm)/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridiem = match12[3].toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Check 24-hour format (e.g. "16:00:00" or "16:00")
  const match24 = str.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return null;
}

export function parseSlotTimeString(slotTimeStr: string): { startMinutes: number; endMinutes: number } | null {
  if (!slotTimeStr) return null;
  // Splits on '–', '-', 'to', 'TO'
  const parts = slotTimeStr.split(/[–\-]|to|TO/i);
  if (parts.length >= 2) {
    const start = parseTimeToMinutes(parts[0]);
    const end = parseTimeToMinutes(parts[1]);
    if (start !== null && end !== null) {
      return { startMinutes: start, endMinutes: end };
    }
  }
  return null;
}

export type SlotTimeValidationResult = 
  | { isValid: true; message: string; formattedTime: string; formattedDate: string }
  | { isValid: false; reason: 'early_arrival'; message: string; formattedTime: string; formattedDate: string }
  | { isValid: false; reason: 'expired'; message: string; formattedTime: string; formattedDate: string };

/**
 * Validates whether the current local time falls within the scheduled slot date & time window.
 * Includes an optional 15-minute early grace buffer prior to slot start time.
 */
export function validateSlotTiming(
  slotDateStr: string | undefined | null,
  slotTimeStr: string | undefined | null,
  slotStartTime?: string | null,
  slotEndTime?: string | null,
  earlyGraceMinutes: number = 15
): SlotTimeValidationResult {
  const displayTime = slotTimeStr || (slotStartTime && slotEndTime ? `${formatTime(slotStartTime)} – ${formatTime(slotEndTime)}` : 'Scheduled Window');

  if (!slotDateStr) {
    return { isValid: true, message: 'Access Granted', formattedTime: displayTime, formattedDate: 'Today' };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDay = String(now.getDate()).padStart(2, '0');
  const todayDateStr = `${currentYear}-${currentMonth}-${currentDay}`;

  const cleanSlotDate = slotDateStr.split('T')[0].trim();
  const displayDate = formatDateReadable(cleanSlotDate) || cleanSlotDate;

  // 1. Date comparison
  if (cleanSlotDate < todayDateStr) {
    return {
      isValid: false,
      reason: 'expired',
      message: `Slot Expired! This pass was valid on ${displayDate} for ${displayTime}.`,
      formattedTime: displayTime,
      formattedDate: displayDate,
    };
  }

  if (cleanSlotDate > todayDateStr) {
    return {
      isValid: false,
      reason: 'early_arrival',
      message: `Too Early! This pass is scheduled for ${displayDate} at ${displayTime}.`,
      formattedTime: displayTime,
      formattedDate: displayDate,
    };
  }

  // 2. Same-Day Time Window Checking (cleanSlotDate === todayDateStr)
  let startMinutes: number | null = null;
  let endMinutes: number | null = null;

  if (slotStartTime && slotEndTime) {
    startMinutes = parseTimeToMinutes(slotStartTime);
    endMinutes = parseTimeToMinutes(slotEndTime);
  }
  
  if (startMinutes === null || endMinutes === null) {
    if (slotTimeStr) {
      const parsed = parseSlotTimeString(slotTimeStr);
      if (parsed) {
        startMinutes = parsed.startMinutes;
        endMinutes = parsed.endMinutes;
      }
    }
  }

  if (startMinutes !== null && endMinutes !== null) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Early arrival: earlier than slot start minus early grace buffer
    if (currentMinutes < startMinutes - earlyGraceMinutes) {
      return {
        isValid: false,
        reason: 'early_arrival',
        message: `Too Early! This slot is valid only at ${displayTime}.`,
        formattedTime: displayTime,
        formattedDate: displayDate,
      };
    }

    // Expired: past slot end time
    if (currentMinutes > endMinutes) {
      return {
        isValid: false,
        reason: 'expired',
        message: `Slot Expired! This pass was valid for ${displayTime}.`,
        formattedTime: displayTime,
        formattedDate: displayDate,
      };
    }
  }

  return { isValid: true, message: 'Access Granted — Admission Verified', formattedTime: displayTime, formattedDate: displayDate };
}

export type SlotAvailabilityStatus = 'available' | 'filling_fast' | 'fully_booked' | 'blocked';

export function getSlotStatus(slot: Slot): SlotAvailabilityStatus {
  if (slot.is_blocked) return 'blocked';
  const booked = slot.booked_capacity || 0;
  const total = slot.total_capacity || 120;
  const remaining = total - booked;

  if (remaining <= 0 || booked >= 120 || booked >= total) return 'fully_booked';
  if (booked >= 81 || (total > 0 && booked / total >= 0.675)) return 'filling_fast';
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
    `Official Showroom VIP Visiting Slot for ${customerName}.\nBooking Ref: ${bookingCode}\n\nStrictly In-Store Viewing.\nPlease show this pass at the reception desk upon arrival.`
  );
  const location = encodeURIComponent('Ayyan Fireworks Flagship Showroom, Main Road / NH-16 (near Natayyapalem), Sheela Nagar, Visakhapatnam, Andhra Pradesh 530012');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

/**
 * Formats a phone number for WhatsApp wa.me URLs.
 * Ensures the India country code (91) is prepended to 10-digit mobile numbers.
 * e.g. "7729992125" -> "917729992125"
 * e.g. "+91 77299 92125" -> "917729992125"
 * e.g. "07729992125" -> "917729992125"
 */
export function formatWhatsAppPhone(phone?: string | number | null): string {
  if (!phone) return '917729992125';
  let cleaned = String(phone).replace(/\D/g, '');

  // Remove leading 0 if 11-digit domestic dialing format
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Prepend 91 country code to 10-digit Indian phone numbers
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }

  return cleaned || '917729992125';
}

const envWhatsAppNumber = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
  '917729992125';

const envDisplayPhone = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DISPLAY_PHONE) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DISPLAY_PHONE) ||
  '+91 77299 92125';

const cleanWhatsAppNumber = formatWhatsAppPhone(envWhatsAppNumber);
const cleanDisplayPhone = String(envDisplayPhone) || '+91 77299 92125';
const defaultWhatsAppMessage = 'Hi! I want to inquire about Ayyan Fireworks crackers and gift boxes.';

/**
 * Generates a direct wa.me WhatsApp URL ensuring the 91 country code is present.
 * e.g. 7729992125 becomes https://wa.me/917729992125
 */
export function formatWhatsAppUrl(phoneNumber?: string | number | null, customMessage?: string): string {
  const targetNumber = formatWhatsAppPhone(phoneNumber || cleanWhatsAppNumber);
  const msg = customMessage !== undefined && customMessage !== null
    ? encodeURIComponent(customMessage)
    : encodeURIComponent(defaultWhatsAppMessage);

  return msg ? `https://wa.me/${targetNumber}?text=${msg}` : `https://wa.me/${targetNumber}`;
}

export const WHATSAPP_CONTACT = {
  businessName: 'Ayyan Fireworks',
  number: cleanWhatsAppNumber,
  display: cleanDisplayPhone,
  defaultMessage: defaultWhatsAppMessage,
  directCallUrl: `tel:+${cleanWhatsAppNumber}`,
  url: `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(defaultWhatsAppMessage)}`
};

export const SHOWROOM_CONTACT = {
  brandName: 'Ayyan Fireworks',
  subBrand: 'Bunny Brand Fancy Fireworks',
  since: 'Since 1987',
  phone: WHATSAPP_CONTACT.display,
  phoneRaw: WHATSAPP_CONTACT.number,
  callUrl: WHATSAPP_CONTACT.directCallUrl,
  whatsapp: WHATSAPP_CONTACT.number,
  whatsappDisplay: WHATSAPP_CONTACT.display,
  whatsappUrl: WHATSAPP_CONTACT.url,
  address: 'Main Road / NH-16 (near Natayyapalem), Sheela Nagar, Visakhapatnam, Andhra Pradesh 530012, India.',
  shortAddress: 'NH-16, Sheela Nagar, Visakhapatnam 530012',
  landmark: 'Near Natayyapalem, Sheela Nagar',
  city: 'Visakhapatnam, Andhra Pradesh',
  pincode: '530012',
  googleMapsUrl: 'https://maps.app.goo.gl/agWQFufKjWkwFbVs7',
  operationalHours: 'Mon - Sun: 05:00 AM – 10:00 PM IST (All 7 Days during Festive Season)'
};

export function getWhatsAppUrl(customMessage?: string, phoneNumber?: string | number | null): string {
  return formatWhatsAppUrl(phoneNumber || WHATSAPP_CONTACT.number, customMessage);
}

const envAdminEmail = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_OWNER_EMAIL || import.meta.env?.VITE_ADMIN_EMAIL)) ||
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_OWNER_EMAIL || process.env?.NEXT_PUBLIC_ADMIN_EMAIL)) ||
  'prasadkolla1968@gmail.com';

export const ADMIN_EMAIL = String(envAdminEmail).trim().toLowerCase();
export const OWNER_EMAIL = ADMIN_EMAIL;

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isAuthorizedOwnerEmail(email?: string | null): boolean {
  return isAuthorizedAdminEmail(email);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
