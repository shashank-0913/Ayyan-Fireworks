import { supabase, isSupabaseConfigured } from '../src/lib/supabase';
import { getSlotStartDateTime } from '../src/lib/utils';

export interface BookingSubmissionPayload {
  slot_id?: string;
  slot_date?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  slot_time?: string;
  customer_name?: string;
  guest_name?: string;
  name?: string;
  phone?: string;
  customer_phone?: string;
  guest_phone?: string;
  requestedDateTime?: number | string;
}

export async function processBookingSubmission(payload: BookingSubmissionPayload): Promise<{
  statusCode: number;
  body: { success?: boolean; error?: string; booking?: any };
}> {
  const {
    slot_id,
    slot_date,
    date,
    start_time,
    slot_time,
    customer_name,
    guest_name,
    name: rawName,
    phone: rawPhone,
    customer_phone,
    guest_phone,
    requestedDateTime: rawRequestedDateTime
  } = payload;

  const dateStr = slot_date || date || '';
  let startTimeStr = start_time || '';

  // If start_time not provided directly, try to extract from slot_time (e.g. "09:00 AM – 10:00 AM")
  if (!startTimeStr && slot_time) {
    const parts = String(slot_time).split(/[–\-]|to/i);
    if (parts.length > 0) {
      startTimeStr = parts[0].trim();
    }
  }

  // Calculate requestedDateTime
  let requestedDateTime: number | null = null;
  if (rawRequestedDateTime !== undefined && rawRequestedDateTime !== null) {
    const parsed = typeof rawRequestedDateTime === 'number' 
      ? rawRequestedDateTime 
      : new Date(rawRequestedDateTime).getTime();
    if (!isNaN(parsed)) {
      requestedDateTime = parsed;
    }
  }

  if (requestedDateTime === null && dateStr && startTimeStr) {
    const dt = getSlotStartDateTime(dateStr, startTimeStr);
    if (dt) {
      requestedDateTime = dt.getTime();
    }
  }

  // 3. Backend API Validation:
  // - In the booking submission endpoint, verify requestedDateTime > Date.now().
  // - Reject any past slot submission with status 400: "This time slot has passed and cannot be booked."
  const now = Date.now();
  if (requestedDateTime === null || requestedDateTime <= now) {
    return {
      statusCode: 400,
      body: {
        error: "This time slot has passed and cannot be booked."
      }
    };
  }

  const name = (customer_name || guest_name || rawName || '').trim();
  const phone = (rawPhone || customer_phone || guest_phone || '').trim();

  if (!name) {
    return {
      statusCode: 400,
      body: { error: "Customer name is required." }
    };
  }

  const digits = phone.replace(/\D/g, '');
  if (!phone || digits.length < 10) {
    return {
      statusCode: 400,
      body: { error: "A valid 10-digit mobile number is required." }
    };
  }

  const cleanPhone = digits.slice(-10);
  const bookingCode = `AYN-${Math.floor(100000 + Math.random() * 900000)}`;
  const displaySlotTime = slot_time || (startTimeStr ? `${startTimeStr}` : 'Scheduled Window');

  let insertedBooking: any = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          customer_name: name,
          phone: cleanPhone,
          customer_phone: cleanPhone,
          slot_date: dateStr,
          slot_time: displaySlotTime,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase booking insertion error:', error);
        return {
          statusCode: 500,
          body: { error: error.message }
        };
      }
      insertedBooking = data;
    } catch (dbErr: any) {
      console.warn('Supabase booking exception:', dbErr);
    }
  }

  const bookingId = insertedBooking?.id || `book-${Date.now()}`;
  const confirmedCode = insertedBooking?.booking_code || bookingCode;

  const resultBooking = {
    id: bookingId,
    booking_code: confirmedCode,
    ticket_code: confirmedCode,
    qr_token: bookingId,
    slot_id: slot_id || null,
    customer_name: name,
    customer_phone: cleanPhone,
    phone: cleanPhone,
    slot_date: dateStr,
    slot_time: displaySlotTime,
    total_amount: 0,
    visitor_count: 1,
    status: 'confirmed',
    created_at: insertedBooking?.created_at || new Date().toISOString()
  };

  return {
    statusCode: 200,
    body: {
      success: true,
      booking: resultBooking
    }
  };
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON request body' });
    }
  }

  const result = await processBookingSubmission(body || {});
  return res.status(result.statusCode).json(result.body);
}
