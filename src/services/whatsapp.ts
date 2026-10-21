/**
 * WhatsApp Business Cloud API Outgoing Message Sender Service
 * Ayyan Fireworks (Bunny Brand)
 *
 * Implements interactive WhatsApp Cloud API components:
 * - Interactive Button Quick Replies (Main Menu, Action Choices)
 * - Interactive Multi-Item Lists (Time Slots, Showroom Locations)
 * - Interactive CTA URL Buttons
 * - Location Request Messages
 */

import { formatWhatsAppPhone, SHOWROOM_CONTACT } from '../lib/utils';

export interface WhatsAppButtonReply {
  type: 'reply';
  reply: {
    id: string;
    title: string;
  };
}

export interface WhatsAppListRow {
  id: string;
  title: string;
  description?: string;
}

export interface WhatsAppListSection {
  title: string;
  rows: WhatsAppListRow[];
}

export interface WhatsAppMessagePayload {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'interactive' | 'text' | 'location' | 'template';
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: any[];
  };
  interactive?: {
    type: 'button' | 'list' | 'cta_url' | 'location_request_message';
    header?: {
      type: 'text';
      text: string;
    };
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action?: {
      button?: string;
      buttons?: WhatsAppButtonReply[];
      sections?: WhatsAppListSection[];
      name?: string;
      parameters?: {
        display_text: string;
        url: string;
      };
    };
  };
  text?: {
    preview_url?: boolean;
    body: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
}

const DEFAULT_FOOTER = 'Ayyan Fireworks • Official Showroom';
const WEBSITE_URL = 'https://vizagayyan.com';

/**
 * Sends any formatted payload to the WhatsApp Business Cloud API
 */
export async function sendWhatsAppMessage(
  payload: WhatsAppMessagePayload,
  config?: { phoneNumberId?: string; accessToken?: string; apiVersion?: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  const phoneId = config?.phoneNumberId ||
    (typeof process !== 'undefined' && (process.env?.WHATSAPP_PHONE_NUMBER_ID || process.env?.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID)) ||
    '';
  const token = config?.accessToken ||
    (typeof process !== 'undefined' && (process.env?.WHATSAPP_ACCESS_TOKEN || process.env?.WHATSAPP_CLOUD_API_TOKEN)) ||
    '';
  const apiVersion = config?.apiVersion || 'v19.0';

  console.log(`[WhatsApp Outgoing API] Dispatching message to: ${payload.to} | Type: ${payload.type} | Interactive Subtype: ${payload.interactive?.type || 'N/A'}`);

  if (!phoneId || !token) {
    console.warn('[WhatsApp Cloud API] Missing Phone ID or Access Token (Env vars not set). Simulating dispatch response (HTTP 200 Mock):', JSON.stringify(payload, null, 2));
    return {
      success: true,
      data: { simulated: true, status: 200, payload }
    };
  }

  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneId}/messages`;

  try {
    console.log(`[WhatsApp Outgoing API] Sending POST to ${endpoint}...`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let data: any;
    try {
      data = await response.json();
    } catch (_jsonErr) {
      const rawText = await response.text().catch(() => '');
      data = { rawBody: rawText };
    }

    console.log(`[WhatsApp Outgoing API Response] HTTP Status: ${response.status} ${response.statusText}`, data);

    if (!response.ok) {
      console.error(`[WhatsApp Cloud API Error HTTP ${response.status}] FULL ERROR RESPONSE BODY FROM META:`, JSON.stringify(data, null, 2));
      return { success: false, error: data?.error?.message || `HTTP ${response.status}`, data };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[WhatsApp Cloud API Network Exception] FULL ERROR DETAILS:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * 1. Main Menu Message (Interactive Buttons)
 * 3 Interactive Options:
 * - Button 1: "Slot Booking" (ID: btn_book_slot)
 * - Button 2: "Location of Store" (ID: btn_showroom_visit)
 * - Button 3: "Website" (ID: btn_visit_website)
 */
export function buildMainMenuPayload(toPhone: string, customerName?: string): WhatsAppMessagePayload {
  const greeting = customerName ? `Hello ${customerName}! ` : 'Namaste! ';
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🎆 Ayyan Fireworks (Bunny Brand)'
      },
      body: {
        text:
          `${greeting}Welcome to Ayyan Fireworks (Bunny Brand, Sivakasi).\n\n` +
          `⏰ Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
          `1️⃣ Click 1 for Slot Booking\n` +
          `2️⃣ Click 2 for Location of the Store\n` +
          `3️⃣ Click 3 for Website`
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'btn_book_slot',
              title: 'Slot Booking'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_showroom_visit',
              title: 'Location of Store'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_visit_website',
              title: 'Website'
            }
          }
        ]
      }
    }
  };
}

/**
 * Fallback Greeting Text Message Payload
 */
export function buildFallbackGreetingTextPayload(toPhone: string): WhatsAppMessagePayload {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'text',
    text: {
      preview_url: true,
      body:
        `🎆 *Welcome to Ayyan Fireworks (Bunny Brand, Sivakasi)*\n\n` +
        `⏰ Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
        `Please select an option below:\n` +
        `1️⃣ Click 1 for Slot Booking\n` +
        `2️⃣ Click 2 for Location of the Store\n` +
        `3️⃣ Click 3 for Website\n\n` +
        `_Reply with 1, 2, or 3 to continue._`
    }
  };
}

/**
 * Builds the approved Meta WhatsApp welcome greeting template payload:
 * {
 *   "messaging_product": "whatsapp",
 *   "recipient_type": "individual",
 *   "to": toPhone,
 *   "type": "template",
 *   "template": {
 *     "name": "ayyan_welcome_v2",
 *     "language": {
 *       "code": "en"
 *     }
 *   }
 * }
 */
export function buildWelcomeTemplatePayload(toPhone: string): WhatsAppMessagePayload {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'template',
    template: {
      name: 'ayyan_welcome_v2',
      language: {
        code: 'en'
      }
    }
  };
}

export async function sendWelcomeTemplate(toPhone: string) {
  const payload = buildWelcomeTemplatePayload(toPhone);
  return sendWhatsAppMessage(payload);
}

export async function sendMainMenu(toPhone: string, _customerName?: string) {
  return sendWelcomeTemplate(toPhone);
}

/**
 * 2. Slot Selection Flow (Interactive List Message)
 * Triggered by btn_book_slot: contains Morning, Afternoon, Evening time slot options
 */
export function buildSlotSelectionListPayload(toPhone: string, dateStr?: string): WhatsAppMessagePayload {
  const dateLabel = dateStr || 'Today / Upcoming Festival Days';
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: '📅 Choose Visiting Slot Window'
      },
      body: {
        text: `Select your preferred showroom visiting window for *${dateLabel}*.\n\nAll time slots include priority parking, air-conditioned billing, and gate QR entry pass:`
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        button: 'Select Slot 🕒',
        sections: [
          {
            title: 'Showroom Visiting Slots',
            rows: [
              {
                id: 'slot_morning',
                title: 'Morning Slot 🌅',
                description: '08:00 AM – 01:00 PM (From 5:00 AM in Diwali season)'
              },
              {
                id: 'slot_afternoon',
                title: 'Afternoon Slot ☀️',
                description: '01:00 PM – 05:00 PM (Relaxed indoor shopping)'
              },
              {
                id: 'slot_evening',
                title: 'Evening Spectacle 🌙',
                description: '05:00 PM – 10:00 PM (Live illuminations & demos)'
              }
            ]
          },
          {
            title: 'Express Booking Options',
            rows: [
              {
                id: 'slot_vip_instant',
                title: 'VIP Instant Pass 🎟️',
                description: 'Instant admission pass for today'
              }
            ]
          }
        ]
      }
    }
  };
}

export async function sendSlotSelectionList(toPhone: string, dateStr?: string) {
  const payload = buildSlotSelectionListPayload(toPhone, dateStr);
  return sendWhatsAppMessage(payload);
}

/**
 * 3. Store Location Flow (Google Maps link & Location Message)
 * Triggered by btn_location
 */
export async function sendStoreLocation(toPhone: string) {
  const target = formatWhatsAppPhone(toPhone);

  // 1. Send Location Coordinates payload
  await sendWhatsAppMessage({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: target,
    type: 'location',
    location: {
      latitude: 17.6868,
      longitude: 83.2185,
      name: SHOWROOM_CONTACT.brandName,
      address: SHOWROOM_CONTACT.address
    }
  });

  // 2. Send detailed address with direct Google Maps link
  return sendWhatsAppMessage({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: target,
    type: 'text',
    text: {
      preview_url: true,
      body: `📍 *Ayyan Fireworks — Flagship Showroom*\n\n🏢 *Address:* ${SHOWROOM_CONTACT.address}\n\n⏰ *Operating Hours:* ${SHOWROOM_CONTACT.operationalHours}\n\n🗺️ *Google Maps Navigation:*\n${SHOWROOM_CONTACT.googleMapsUrl}\n\n📞 *Showroom Helpline:* ${SHOWROOM_CONTACT.phone}`
    }
  });
}

/**
 * 3.1 Interactive Live Location Request Message
 */
export function buildLocationRequestPayload(toPhone: string): WhatsAppMessagePayload {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'location_request_message',
      body: {
        text: 'Tap below to share your current location and receive live turn-by-turn navigation to Ayyan Fireworks showroom:'
      },
      action: {
        name: 'send_location'
      }
    }
  };
}

export async function sendLocationRequest(toPhone: string) {
  const payload = buildLocationRequestPayload(toPhone);
  return sendWhatsAppMessage(payload);
}

/**
 * 4. Website Link Flow
 * Triggered by btn_website
 */
export async function sendWebsiteLink(toPhone: string) {
  return sendWhatsAppMessage({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'text',
    text: {
      preview_url: true,
      body: `🌐 *Ayyan Fireworks Online Portal*\n\nExplore our 2026 digital cracker catalogue, check live prices, and generate your VIP Showroom Pass:\n\n👉 *Visit Website:* ${WEBSITE_URL}\n👉 *Browse Catalogue:* ${WEBSITE_URL}/catalogue\n👉 *Book Slot Online:* ${WEBSITE_URL}/book-slot`
    }
  });
}

/**
 * 5. Text Message Fallback / General Text
 */
export async function sendTextMessage(toPhone: string, text: string) {
  return sendWhatsAppMessage({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'text',
    text: {
      preview_url: true,
      body: text
    }
  });
}
