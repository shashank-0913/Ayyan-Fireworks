/**
 * WhatsApp Business Cloud API Interactive Messaging Engine & Webhook Handler
 * Ayyan Fireworks (Bunny Brand)
 *
 * Implements Meta WhatsApp Cloud API interactive messages:
 * - Quick-Reply Buttons (type: "interactive", interactive.type: "button")
 * - Multi-Item Interactive Lists (type: "interactive", interactive.type: "list")
 * - Call-To-Action URL Buttons (type: "interactive", interactive.type: "cta_url")
 * - Location Request Messages (type: "interactive", interactive.type: "location_request_message")
 * - Webhook payload parser extracting button_reply.id and list_reply.id
 * - Action ID routing with standard text fallback
 */

import { formatWhatsAppPhone, SHOWROOM_CONTACT } from './utils';

// ============================================================================
// 1. WhatsApp Cloud API Payload Type Definitions
// ============================================================================

export interface WhatsAppButtonReplyAction {
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

export interface WhatsAppInteractiveHeader {
  type: 'text' | 'image' | 'video' | 'document';
  text?: string;
  image?: { link: string };
  video?: { link: string };
  document?: { link: string; filename?: string };
}

export interface WhatsAppButtonInteractive {
  type: 'button';
  header?: WhatsAppInteractiveHeader;
  body: { text: string };
  footer?: { text: string };
  action: {
    buttons: WhatsAppButtonReplyAction[];
  };
}

export interface WhatsAppListInteractive {
  type: 'list';
  header?: WhatsAppInteractiveHeader;
  body: { text: string };
  footer?: { text: string };
  action: {
    button: string; // The button title that opens the list menu
    sections: WhatsAppListSection[];
  };
}

export interface WhatsAppCtaUrlInteractive {
  type: 'cta_url';
  header?: WhatsAppInteractiveHeader;
  body: { text: string };
  footer?: { text: string };
  action: {
    name: 'cta_url';
    parameters: {
      display_text: string;
      url: string;
    };
  };
}

export interface WhatsAppLocationRequestInteractive {
  type: 'location_request_message';
  body: { text: string };
  action: {
    name: 'send_location';
  };
}

export type WhatsAppInteractivePayload =
  | WhatsAppButtonInteractive
  | WhatsAppListInteractive
  | WhatsAppCtaUrlInteractive
  | WhatsAppLocationRequestInteractive;

export interface WhatsAppMessageEnvelope {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'interactive' | 'text' | 'location' | 'template';
  interactive?: WhatsAppInteractivePayload;
  text?: {
    preview_url?: boolean;
    body: string;
  };
  location?: {
    longitude: number;
    latitude: number;
    name?: string;
    address?: string;
  };
}

// ============================================================================
// 2. Incoming Webhook Event Interfaces
// ============================================================================

export interface ParsedIncomingWhatsAppMessage {
  from: string; // Cleaned phone number
  senderName?: string;
  messageId: string;
  timestamp: string;
  type: 'interactive' | 'text' | 'location' | 'button' | 'unknown';
  actionId?: string; // Extracted button_reply.id or list_reply.id
  actionTitle?: string;
  textBody?: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  rawPayload: any;
}

export interface WhatsAppBotResponse {
  messages: WhatsAppMessageEnvelope[];
  metadata?: Record<string, any>;
}

// ============================================================================
// 3. Outgoing Interactive Message Builders
// ============================================================================

const DEFAULT_FOOTER = 'Ayyan Fireworks • Bunny Brand Official';
const WEBSITE_BASE_URL = typeof window !== 'undefined' && window.location.origin
  ? window.location.origin
  : 'https://ayyanfireworks.com';

/**
 * 3.1 Main Menu Interactive Message (Quick Reply Buttons)
 */
export function buildMainMenuMessage(toPhone: string, customerName?: string): WhatsAppMessageEnvelope {
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
        text: '🎆 Ayyan Fireworks • Sivakasi'
      },
      body: {
        text: `${greeting}Welcome to Ayyan Fireworks (Bunny Brand, Since 1987).\n\nExperience India's premier certified green fireworks showroom with live demos & direct manufacturer pricing.\n\nPlease select an option below:`
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'menu_book_slot',
              title: '📅 Book VIP Slot'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'menu_view_catalogue',
              title: '🎆 View Catalogue'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'menu_find_location',
              title: '📍 Showrooms & Map'
            }
          }
        ]
      }
    }
  };
}

/**
 * 3.2 Time of Day Slot Options (type: "interactive", subtype: "button" quick replies)
 * Replaces old "Reply 1 for Morning, 2 for Afternoon" text messages
 */
export function buildSlotTimeOfDayButtonMessage(toPhone: string, dateStr: string): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🕒 Showroom Time Window'
      },
      body: {
        text: `Please choose your visiting time window for *${dateStr}*.\n\nAll time slots include exclusive air-conditioned parking, priority cashier counters, and safe demonstration areas:`
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'slot_morning',
              title: '🌅 Morning (9AM-1PM)'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'slot_afternoon',
              title: '☀️ Noon (1PM-5PM)'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'slot_evening',
              title: '🌙 Eve (5PM-10PM)'
            }
          }
        ]
      }
    }
  };
}

/**
 * 3.3 Multi-Item Location Branches Menu (type: "interactive", subtype: "list")
 * Replaces numbered location text lists with interactive multi-item menu
 */
export function buildBranchLocationsListMessage(toPhone: string): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: '📍 Showroom Branches & Hubs'
      },
      body: {
        text: 'Select an Ayyan Fireworks showroom or distribution counter to receive live GPS directions, complete address, and operational timings:'
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        button: 'Select Branch',
        sections: [
          {
            title: 'Flagship Showroom',
            rows: [
              {
                id: 'loc_branch_main',
                title: 'Sheela Nagar Flagship',
                description: 'NH-16 near Natayyapalem, Vizag (5AM–10PM)'
              }
            ]
          },
          {
            title: 'Express Regional Counters',
            rows: [
              {
                id: 'loc_branch_gajuwaka',
                title: 'Gajuwaka Express Hub',
                description: 'BHPV Post, High Safety Zone, Vizag'
              },
              {
                id: 'loc_branch_madhurawada',
                title: 'Madhurawada Counter',
                description: 'Car Shed Junction, PM Palem, Vizag'
              },
              {
                id: 'loc_branch_sivakasi',
                title: 'Sivakasi Factory Works',
                description: 'Original Sivakasi Fireworks Factory, TN'
              }
            ]
          }
        ]
      }
    }
  };
}

/**
 * 3.4 Multi-Item Date Selection Menu (type: "interactive", subtype: "list")
 * Renders list of upcoming festive booking dates
 */
export function buildDateSelectionListMessage(
  toPhone: string,
  dates: Array<{ dateStr: string; label: string; subtext?: string }>
): WhatsAppMessageEnvelope {
  const rows: WhatsAppListRow[] = dates.slice(0, 10).map((d) => ({
    id: `date_${d.dateStr}`,
    title: d.label.slice(0, 24),
    description: d.subtext ? d.subtext.slice(0, 72) : 'Slots available for booking'
  }));

  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: '📅 Select Visiting Date'
      },
      body: {
        text: 'Please select your preferred festive visit date for Ayyan Fireworks Showroom:'
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        button: 'Choose Date',
        sections: [
          {
            title: 'Available Visiting Dates',
            rows
          }
        ]
      }
    }
  };
}

/**
 * 3.5 Call-To-Action (CTA) URL Button for Web Booking
 */
export function buildWebBookingCtaMessage(
  toPhone: string,
  customBookingUrl?: string
): WhatsAppMessageEnvelope {
  const bookingUrl = customBookingUrl || `${WEBSITE_BASE_URL}/book`;
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'cta_url',
      header: {
        type: 'text',
        text: '🎟️ VIP Showroom Slot Pass'
      },
      body: {
        text: 'Book your exclusive showroom slot online with zero waiting time, instant QR Pass generation, and fast-track entrance gate clearance:'
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        name: 'cta_url',
        parameters: {
          display_text: '⚡ Open Booking Portal',
          url: bookingUrl
        }
      }
    }
  };
}

/**
 * 3.6 Call-To-Action (CTA) URL Button for Public Catalogue
 */
export function buildCatalogueCtaMessage(
  toPhone: string,
  customCatalogueUrl?: string
): WhatsAppMessageEnvelope {
  const catalogueUrl = customCatalogueUrl || `${WEBSITE_BASE_URL}/catalogue`;
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'cta_url',
      header: {
        type: 'text',
        text: '✨ 2026 Crackers Catalogue'
      },
      body: {
        text: 'Explore 50+ authentic Sivakasi fireworks: Bunny brand sparklers, aerial multi-shots, sound maroons, and premium family gift hampers.'
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        name: 'cta_url',
        parameters: {
          display_text: '📖 Browse Full Catalogue',
          url: catalogueUrl
        }
      }
    }
  };
}

/**
 * 3.7 Live Location Request Message (type: "interactive", subtype: "location_request_message")
 */
export function buildLocationRequestInteractiveMessage(toPhone: string): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'location_request_message',
      body: {
        text: 'Tap the button below to share your current location and get immediate Google Maps navigation to the nearest Ayyan Fireworks showroom:'
      },
      action: {
        name: 'send_location'
      }
    }
  };
}

/**
 * 3.8 Booking Confirmation Interactive Buttons Message
 */
export function buildBookingConfirmationInteractiveMessage(
  toPhone: string,
  booking: {
    booking_code: string;
    customer_name: string;
    slot_date: string;
    slot_time: string;
    visitor_count?: number;
  },
  passUrl?: string
): WhatsAppMessageEnvelope {
  const bookingPassUrl = passUrl || `${WEBSITE_BASE_URL}/my-bookings`;
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: `🎟️ Slot Confirmed: ${booking.booking_code}`
      },
      body: {
        text: `*Reservation Confirmed for ${booking.customer_name}!*\n\n📅 *Date:* ${booking.slot_date}\n⏰ *Window:* ${booking.slot_time}\n👥 *Visitors:* ${booking.visitor_count || 1} Person(s)\n\n📱 *Digital QR Pass:* ${bookingPassUrl}\n\nPresent your digital QR pass at the entrance gate for priority admission.`
      },
      footer: {
        text: DEFAULT_FOOTER
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: `pass_view_${booking.booking_code}`,
              title: '📱 Show My QR Pass'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'loc_branch_main',
              title: '📍 Get Directions'
            }
          },
          {
            type: 'reply',
            reply: {
              id: `cancel_prompt_${booking.booking_code}`,
              title: '❌ Cancel Booking'
            }
          }
        ]
      }
    }
  };
}

/**
 * 3.9 Standard Fallback Text Message
 */
export function buildTextMessage(toPhone: string, text: string): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'text',
    text: {
      preview_url: true,
      body: text
    }
  };
}

// ============================================================================
// 4. Incoming Webhook Parser
// ============================================================================

/**
 * Parses raw Meta WhatsApp Business Cloud API incoming webhook payload.
 * Extracts interactive button_reply.id and list_reply.id with full text fallback.
 */
export function parseWhatsAppWebhookPayload(rawBody: any): ParsedIncomingWhatsAppMessage | null {
  try {
    if (!rawBody) return null;

    // Check entry structure: entry[0].changes[0].value.messages[0]
    const entry = rawBody.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    if (!change || !change.messages || change.messages.length === 0) {
      return null;
    }

    const message = change.messages[0];
    const contact = change.contacts?.[0];
    const fromNumber = formatWhatsAppPhone(message.from);
    const senderName = contact?.profile?.name || undefined;
    const messageId = message.id || `msg_${Date.now()}`;
    const timestamp = message.timestamp || String(Math.floor(Date.now() / 1000));
    const msgType = message.type;

    // Case 1: Interactive Messages (button_reply or list_reply)
    if (msgType === 'interactive' && message.interactive) {
      const interactive = message.interactive;

      // Button Quick Reply
      if (interactive.type === 'button_reply' && interactive.button_reply) {
        return {
          from: fromNumber,
          senderName,
          messageId,
          timestamp,
          type: 'interactive',
          actionId: interactive.button_reply.id,
          actionTitle: interactive.button_reply.title,
          textBody: interactive.button_reply.title,
          rawPayload: message
        };
      }

      // List Menu Selection
      if (interactive.type === 'list_reply' && interactive.list_reply) {
        return {
          from: fromNumber,
          senderName,
          messageId,
          timestamp,
          type: 'interactive',
          actionId: interactive.list_reply.id,
          actionTitle: interactive.list_reply.title,
          textBody: interactive.list_reply.title,
          rawPayload: message
        };
      }
    }

    // Case 2: Legacy Template Buttons (type: "button")
    if (msgType === 'button' && message.button) {
      return {
        from: fromNumber,
        senderName,
        messageId,
        timestamp,
        type: 'button',
        actionId: message.button.payload || message.button.text,
        actionTitle: message.button.text,
        textBody: message.button.text,
        rawPayload: message
      };
    }

    // Case 3: Standard Text Message
    if (msgType === 'text' && message.text?.body) {
      return {
        from: fromNumber,
        senderName,
        messageId,
        timestamp,
        type: 'text',
        textBody: message.text.body.trim(),
        rawPayload: message
      };
    }

    // Case 4: Location Share Message
    if (msgType === 'location' && message.location) {
      return {
        from: fromNumber,
        senderName,
        messageId,
        timestamp,
        type: 'location',
        location: {
          latitude: message.location.latitude,
          longitude: message.location.longitude,
          name: message.location.name,
          address: message.location.address
        },
        rawPayload: message
      };
    }

    return {
      from: fromNumber,
      senderName,
      messageId,
      timestamp,
      type: 'unknown',
      rawPayload: message
    };
  } catch (err) {
    console.error('Error parsing WhatsApp Cloud API webhook payload:', err);
    return null;
  }
}

// ============================================================================
// 5. Incoming Webhook Router & Action Dispatcher
// ============================================================================

export interface WebhookRouterContext {
  websiteUrl?: string;
  supabaseClient?: any;
  currentDate?: string;
}

/**
 * Handles parsed incoming WhatsApp webhook events:
 * - Routes based on interactive action IDs (slot_morning, loc_branch_main, etc.)
 * - Executes fallback matching for plain text messages (e.g. "1", "slot", "hi")
 */
export async function handleWhatsAppWebhookEvent(
  event: ParsedIncomingWhatsAppMessage,
  ctx?: WebhookRouterContext
): Promise<WhatsAppBotResponse> {
  const { from, actionId, textBody, senderName, type } = event;
  const webUrl = ctx?.websiteUrl || WEBSITE_BASE_URL;
  const todayStr = ctx?.currentDate || new Date().toISOString().split('T')[0];

  // --------------------------------------------------------------------------
  // A. INTERACTIVE ACTION ID ROUTING
  // --------------------------------------------------------------------------
  if (actionId) {
    console.log(`[WhatsApp Bot] Processing Interactive Action ID: "${actionId}" from ${from}`);

    // 1. Main Menu Navigation
    if (actionId === 'menu_book_slot') {
      const dates = [
        { dateStr: todayStr, label: 'Today (Priority Entry)', subtext: 'Immediate showroom admission slots' },
        { dateStr: getNextDateStr(todayStr, 1), label: 'Tomorrow', subtext: 'Pre-book morning & evening slots' },
        { dateStr: getNextDateStr(todayStr, 2), label: 'Day After Tomorrow', subtext: 'Festive weekend booking' },
        { dateStr: getNextDateStr(todayStr, 3), label: 'Next Weekend', subtext: 'Peak Diwali season access' }
      ];
      return {
        messages: [
          buildDateSelectionListMessage(from, dates),
          buildWebBookingCtaMessage(from, `${webUrl}/book`)
        ],
        metadata: { action: 'date_selection_sent' }
      };
    }

    if (actionId === 'menu_view_catalogue') {
      return {
        messages: [
          buildCatalogueCtaMessage(from, `${webUrl}/catalogue`),
          buildTextMessage(
            from,
            '🎆 *Ayyan Fireworks Highlights:*\n• 100% Certified Green Crackers\n• Low Smoke & Reduced Decibel Formula\n• Original Sivakasi Factory Fresh Packaging\n• Wholesale Box Rates for Festive Gifting'
          )
        ],
        metadata: { action: 'catalogue_cta_sent' }
      };
    }

    if (actionId === 'menu_find_location') {
      return {
        messages: [
          buildBranchLocationsListMessage(from),
          buildLocationRequestInteractiveMessage(from)
        ],
        metadata: { action: 'branch_list_sent' }
      };
    }

    // 2. Time-of-Day Quick Reply Buttons
    if (actionId === 'slot_morning') {
      return {
        messages: [
          buildTextMessage(
            from,
            '🌅 *Morning Window Selected (09:00 AM – 01:00 PM)*\n\nTo complete your reservation and generate your VIP QR Pass, please confirm online or enter your name:'
          ),
          buildWebBookingCtaMessage(from, `${webUrl}/book?window=morning`)
        ],
        metadata: { selectedWindow: 'morning' }
      };
    }

    if (actionId === 'slot_afternoon') {
      return {
        messages: [
          buildTextMessage(
            from,
            '☀️ *Afternoon Window Selected (01:00 PM – 05:00 PM)*\n\nComfortable indoor shopping with dedicated support staff. Click below to confirm your pass:'
          ),
          buildWebBookingCtaMessage(from, `${webUrl}/book?window=afternoon`)
        ],
        metadata: { selectedWindow: 'afternoon' }
      };
    }

    if (actionId === 'slot_evening') {
      return {
        messages: [
          buildTextMessage(
            from,
            '🌙 *Evening Spectacle Window Selected (05:00 PM – 10:00 PM)*\n\nIncludes live outdoor fireworks demonstration & night illuminations. Click below to lock your pass:'
          ),
          buildWebBookingCtaMessage(from, `${webUrl}/book?window=evening`)
        ],
        metadata: { selectedWindow: 'evening' }
      };
    }

    // 3. Date Selection List Rows (e.g. "date_2026-10-20")
    if (actionId.startsWith('date_')) {
      const selectedDate = actionId.replace('date_', '');
      return {
        messages: [
          buildSlotTimeOfDayButtonMessage(from, selectedDate)
        ],
        metadata: { selectedDate }
      };
    }

    // 4. Branch Selection List Rows (e.g. "loc_branch_main")
    if (actionId === 'loc_branch_main') {
      return {
        messages: [
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: from,
            type: 'location',
            location: {
              latitude: 17.6868,
              longitude: 83.2185,
              name: SHOWROOM_CONTACT.brandName,
              address: SHOWROOM_CONTACT.address
            }
          },
          buildTextMessage(
            from,
            `📍 *Ayyan Fireworks Flagship Showroom*\n\n🏢 *Address:* ${SHOWROOM_CONTACT.address}\n\n⏰ *Operating Hours:* ${SHOWROOM_CONTACT.operationalHours}\n\n🗺️ *Google Maps:* ${SHOWROOM_CONTACT.googleMapsUrl}\n\n📞 *Call / Desk:* ${SHOWROOM_CONTACT.phone}`
          )
        ],
        metadata: { branch: 'main' }
      };
    }

    if (actionId === 'loc_branch_gajuwaka') {
      return {
        messages: [
          buildTextMessage(
            from,
            '📍 *Ayyan Fireworks — Gajuwaka Distribution Counter*\n\n🏢 *Address:* BHPV Post Road, Gajuwaka Industrial Zone, Visakhapatnam 530012.\n⏰ *Hours:* 08:00 AM – 09:00 PM IST\n📞 *Helpline:* +91 77299 92125'
          )
        ],
        metadata: { branch: 'gajuwaka' }
      };
    }

    if (actionId === 'loc_branch_madhurawada') {
      return {
        messages: [
          buildTextMessage(
            from,
            '📍 *Ayyan Fireworks — Madhurawada Express Counter*\n\n🏢 *Address:* Near Car Shed Junction, PM Palem, Madhurawada, Visakhapatnam 530048.\n⏰ *Hours:* 08:00 AM – 09:30 PM IST\n📞 *Helpline:* +91 77299 92125'
          )
        ],
        metadata: { branch: 'madhurawada' }
      };
    }

    if (actionId === 'loc_branch_sivakasi') {
      return {
        messages: [
          buildTextMessage(
            from,
            '📍 *Ayyan Fireworks — Sivakasi Factory Headquarters*\n\n🏢 *Address:* Ayyan Fireworks Main Works, Sivakasi, Tamil Nadu 626123.\n🏭 *Status:* Authentic Manufacturer & Distribution HQ'
          )
        ],
        metadata: { branch: 'sivakasi' }
      };
    }

    // 5. Booking Pass Actions
    if (actionId.startsWith('pass_view_')) {
      const code = actionId.replace('pass_view_', '');
      return {
        messages: [
          buildTextMessage(
            from,
            `🎟️ *Your Digital Ticket Code:* *${code}*\n\nAccess your QR Pass and show it to our gate scanner staff at the entrance:\n👉 ${webUrl}/my-bookings?phone=${from.slice(-10)}`
          )
        ],
        metadata: { code }
      };
    }

    if (actionId.startsWith('cancel_prompt_')) {
      const code = actionId.replace('cancel_prompt_', '');
      return {
        messages: [
          buildTextMessage(
            from,
            `To manage or reschedule your reservation (*${code}*), visit the booking management portal:\n👉 ${webUrl}/my-bookings?phone=${from.slice(-10)}`
          )
        ],
        metadata: { code }
      };
    }
  }

  // --------------------------------------------------------------------------
  // B. USER SHARED LIVE LOCATION MESSAGE
  // --------------------------------------------------------------------------
  if (type === 'location' && event.location) {
    return {
      messages: [
        buildTextMessage(
          from,
          `📍 Thank you for sharing your location!\n\nThe nearest showroom is our *Flagship Store at Sheela Nagar (NH-16)*.\n\n🚗 *Estimated Distance:* ~10-20 mins\n🗺️ *Directions:* ${SHOWROOM_CONTACT.googleMapsUrl}`
        ),
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: from,
          type: 'location',
          location: {
            latitude: 17.6868,
            longitude: 83.2185,
            name: SHOWROOM_CONTACT.brandName,
            address: SHOWROOM_CONTACT.address
          }
        }
      ],
      metadata: { action: 'location_reply_sent' }
    };
  }

  // --------------------------------------------------------------------------
  // C. FALLBACK HANDLING FOR STANDARD TEXT MESSAGES
  // --------------------------------------------------------------------------
  const normalizedText = (textBody || '').trim().toLowerCase();

  // 1. Numbered Replies Fallback (1 for slot, 2 for catalogue, 3 for location)
  if (normalizedText === '1' || normalizedText.includes('slot') || normalizedText.includes('book') || normalizedText.includes('ticket') || normalizedText.includes('pass')) {
    const dates = [
      { dateStr: todayStr, label: 'Today (Priority Entry)', subtext: 'Immediate showroom admission slots' },
      { dateStr: getNextDateStr(todayStr, 1), label: 'Tomorrow', subtext: 'Pre-book morning & evening slots' },
      { dateStr: getNextDateStr(todayStr, 2), label: 'Day After Tomorrow', subtext: 'Festive weekend booking' }
    ];
    return {
      messages: [
        buildDateSelectionListMessage(from, dates),
        buildWebBookingCtaMessage(from, `${webUrl}/book`)
      ],
      metadata: { fallbackTrigger: '1_slot' }
    };
  }

  if (normalizedText === '2' || normalizedText.includes('catalogue') || normalizedText.includes('catalog') || normalizedText.includes('price') || normalizedText.includes('cracker') || normalizedText.includes('item')) {
    return {
      messages: [
        buildCatalogueCtaMessage(from, `${webUrl}/catalogue`)
      ],
      metadata: { fallbackTrigger: '2_catalogue' }
    };
  }

  if (normalizedText === '3' || normalizedText.includes('location') || normalizedText.includes('address') || normalizedText.includes('map') || normalizedText.includes('directions') || normalizedText.includes('where')) {
    return {
      messages: [
        buildBranchLocationsListMessage(from),
        buildLocationRequestInteractiveMessage(from)
      ],
      metadata: { fallbackTrigger: '3_location' }
    };
  }

  // 2. Greetings / Menu Request Fallback
  return {
    messages: [
      buildMainMenuMessage(from, senderName)
    ],
    metadata: { fallbackTrigger: 'main_menu' }
  };
}

// ============================================================================
// 6. WhatsApp Cloud API Client Dispatcher
// ============================================================================

export interface WhatsAppApiConfig {
  phoneNumberId?: string;
  accessToken?: string;
  apiVersion?: string;
}

/**
 * Sends a message payload to Meta WhatsApp Cloud API endpoint.
 */
export async function sendWhatsAppCloudMessage(
  payload: WhatsAppMessageEnvelope,
  config?: WhatsAppApiConfig
): Promise<{ success: boolean; data?: any; error?: string }> {
  const phoneId = config?.phoneNumberId ||
    (typeof process !== 'undefined' && (process.env?.WHATSAPP_PHONE_NUMBER_ID || process.env?.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID)) ||
    '';
  const token = config?.accessToken ||
    (typeof process !== 'undefined' && (process.env?.WHATSAPP_ACCESS_TOKEN || process.env?.WHATSAPP_CLOUD_API_TOKEN)) ||
    '';
  const apiVersion = config?.apiVersion || 'v19.0';

  if (!phoneId || !token) {
    console.warn('[WhatsApp Cloud API] Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN. Simulating dispatch:', payload);
    return {
      success: true,
      data: { simulated: true, message_id: `sim_${Date.now()}` }
    };
  }

  const url = `https://graph.facebook.com/${apiVersion}/${phoneId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('[WhatsApp Cloud API Error]:', result);
      return {
        success: false,
        error: result.error?.message || `HTTP ${response.status}: Failed to send WhatsApp message`
      };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error('[WhatsApp Cloud API Network Error]:', err);
    return { success: false, error: err?.message || 'Network exception' };
  }
}

// ============================================================================
// Helper Utilities
// ============================================================================

function getNextDateStr(baseDateStr: string, dayOffset: number): string {
  try {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + dayOffset);
    return d.toISOString().split('T')[0];
  } catch (e) {
    return baseDateStr;
  }
}
