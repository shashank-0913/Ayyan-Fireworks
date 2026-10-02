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
  type: 'interactive' | 'text' | 'location';
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
const WEBSITE_URL = typeof window !== 'undefined' && window.location.origin
  ? window.location.origin
  : 'https://ayyanfireworks.com';

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

  if (!phoneId || !token) {
    console.warn('[WhatsApp Cloud API] Missing Phone ID or Access Token. Simulating dispatch:', payload);
    return {
      success: true,
      data: { simulated: true, payload }
    };
  }

  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneId}/messages`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[WhatsApp Cloud API Error]:', data);
      return { success: false, error: data.error?.message || `HTTP ${response.status}` };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[WhatsApp Cloud API Exception]:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * 1. Main Menu Message (Interactive Buttons)
 * Replaces "Reply 1 for slot, 2 for location..."
 * - Button 1: "Book Slot 📅" (ID: btn_book_slot)
 * - Button 2: "Store Location 📍" (ID: btn_location)
 * - Button 3: "Visit Website 🌐" (ID: btn_website)
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
        text: `${greeting}Welcome to Ayyan Fireworks — authentic Sivakasi fireworks manufacturer showroom since 1987.\n\nPlease select an option below:`
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
              title: 'Book Slot 📅'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_location',
              title: 'Store Location 📍'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_website',
              title: 'Visit Website 🌐'
            }
          }
        ]
      }
    }
  };
}

export async function sendMainMenu(toPhone: string, customerName?: string) {
  const payload = buildMainMenuPayload(toPhone, customerName);
  return sendWhatsAppMessage(payload);
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
                description: '09:00 AM – 01:00 PM (Quick entrance & fresh stock)'
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
      body: `🌐 *Ayyan Fireworks Online Portal*\n\nExplore our 2026 digital cracker catalogue, check live prices, and generate your VIP Showroom Pass:\n\n👉 *Visit Website:* ${WEBSITE_URL}\n👉 *Browse Catalogue:* ${WEBSITE_URL}/catalogue\n👉 *Book Slot Online:* ${WEBSITE_URL}/book`
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
