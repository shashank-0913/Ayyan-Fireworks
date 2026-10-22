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

export interface WhatsAppTemplatePayload {
  name: string;
  language: {
    code: string;
  };
  components?: any[];
}

export interface WhatsAppMessageEnvelope {
  messaging_product: 'whatsapp';
  recipient_type?: 'individual';
  to: string;
  type: 'interactive' | 'text' | 'location' | 'template' | 'document';
  template?: WhatsAppTemplatePayload;
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
  document?: {
    link: string;
    caption?: string;
    filename?: string;
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
const WEBSITE_BASE_URL = 'https://vizagayyan.com';

/**
 * 3.0 Fallback Greeting Text Message
 * Formats numbered choices:
 * 1️⃣ Click 1 for Website
 * 2️⃣ Click 2 for Location of the Store
 * Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)
 */
export function buildFallbackGreetingTextMessage(toPhone: string): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'text',
    text: {
      preview_url: true,
      body:
        `Welcome to Ayyan Fireworks, Visakhapatnam! 🎆\n\n` +
        `Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
        `Please select an option below:\n` +
        `1️⃣ Click 1 for Website\n` +
        `2️⃣ Click 2 for Location of the Store\n\n` +
        `Tell me your queries! You can also ask any question about our crackers, pricing, and offers.`,
    },
  };
}

/**
 * 3.1 Main Menu Interactive Quick-Reply Buttons Message
 * 2 Options:
 * Button 1: Visit Website (id: "btn_visit_website") -> https://vizagayyan.com
 * Button 2: Store Location (id: "btn_showroom_visit") -> https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam
 */
export function buildMainMenuButtonMessage(toPhone: string): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text:
          `Welcome to Ayyan Fireworks, Visakhapatnam! 🎆\n\n` +
          `Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
          `Please select an option below:`,
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'btn_visit_website',
              title: 'Visit Website',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_showroom_visit',
              title: 'Store Location',
            },
          },
        ],
      },
    },
  };
}
/**
 * 3.2 Main Menu Template Message (Meta Approved Template fallback)
 */
export function buildMainMenuMessage(toPhone: string): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'template',
    template: {
      name: 'ayyan_menu_v2',
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: {
                link: 'https://vizagayyan.com/ayyan_images/bunny_brand_logo.png'
              }
            }
          ]
        }
      ]
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
        text: `Please choose your visiting time window for *${dateStr}*.\n\n⏰ *Regular Hours:* 8:00 AM – 10:00 PM\n✨ *Special Diwali Season Hours:* 5:00 AM – 10:00 PM\n\nAll time slots include exclusive air-conditioned parking, priority cashier counters, and safe demonstration areas:`
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
              title: '🌅 Morning (8AM-1PM)'
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
                description: 'NH-16 near Natayyapalem | 8AM-10PM (Diwali 5AM-10PM)'
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
  const bookingUrl = customBookingUrl || `${WEBSITE_BASE_URL}/book-slot`;
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

/**
 * 3.10 Approved Meta WhatsApp Welcome Greeting Template Message
 * Sends approved "ayyan_menu_v2" template with image header and buttons
 */
export function buildWelcomeTemplateMessage(
  toPhone: string,
  templateName: string = 'ayyan_menu_v2'
): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: {
                link: 'https://vizagayyan.com/ayyan_images/bunny_brand_logo.png'
              }
            }
          ]
        }
      ]
    }
  };
}

/** Default public URL to 2025-26 Price List PDF */
export const DEFAULT_PRICE_LIST_PDF_URL = `${WEBSITE_BASE_URL}/Ayyan_Fireworks_Price_List_2025-26.pdf`;

/**
 * 3.11 WhatsApp Document Attachment Message (Price List Catalog PDF)
 */
export function buildCatalogPdfDocumentMessage(
  toPhone: string,
  pdfUrl: string = DEFAULT_PRICE_LIST_PDF_URL,
  filename: string = 'Ayyan_Fireworks_Price_List_2025-26.pdf',
  caption: string = '📄 Ayyan Fireworks Sivakasi 2025-26 Wholesale & Retail Price List'
): WhatsAppMessageEnvelope {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formatWhatsAppPhone(toPhone),
    type: 'document',
    document: {
      link: pdfUrl,
      filename,
      caption
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
  const { from, actionId, textBody, type } = event;
  const webUrl = ctx?.websiteUrl || WEBSITE_BASE_URL;

  // --------------------------------------------------------------------------
  // A. INTERACTIVE ACTION ID ROUTING
  // --------------------------------------------------------------------------
  if (actionId) {
    console.log(`[WhatsApp Bot] Processing Interactive Action ID: "${actionId}" from ${from}`);

    /*
    // 1. Main Menu Navigation: Option 3 / btn_book_slot - Book VIP Slot (Temporarily Hidden)
    if (
      actionId === 'btn_book_slot' ||
      actionId === 'btn_slot_booking' ||
      actionId === 'menu_book_slot' ||
      actionId === '3'
    ) {
      return {
        messages: [
          buildTextMessage(
            from,
            "🎟️ *Showroom Slot Booking:*\nhttps://vizagayyan.com"
          )
        ],
        metadata: { action: 'book_vip_slot_sent' }
      };
    }
    */

    // View Catalogue Button Callback (from template button or interactive button)
    if (
      actionId === 'view_catalogue' ||
      actionId === 'btn_view_catalogue' ||
      actionId === 'menu_view_catalogue' ||
      actionId.toLowerCase() === 'view catalogue' ||
      event.actionTitle?.toLowerCase() === 'view catalogue' ||
      event.actionTitle?.toLowerCase().includes('catalogue')
    ) {
      return {
        messages: [
          buildTextMessage(
            from,
            'Explore our full catalogue here: https://vizagayyan.com'
          )
        ],
        metadata: { action: 'view_catalogue_sent' }
      };
    }

    // Download Price List PDF / Catalog Document Attachment Button Callback
    if (
      actionId === 'btn_download_pdf' ||
      actionId === 'btn_pricelist_pdf' ||
      actionId === 'download_pdf' ||
      actionId === 'view_pricelist'
    ) {
      return {
        messages: [
          buildCatalogPdfDocumentMessage(from),
          buildTextMessage(
            from,
            `📄 Here is the official Ayyan Fireworks 2025-26 Price List PDF.\n👉 Download direct: ${DEFAULT_PRICE_LIST_PDF_URL}`
          )
        ],
        metadata: { action: 'pricelist_pdf_document_sent' }
      };
    }

    // 2. Main Menu Navigation: Option 2 - Location of the Store
    if (
      actionId === 'btn_showroom_visit' ||
      actionId === 'btn_showroom' ||
      actionId === 'btn_location' ||
      actionId === 'menu_find_location' ||
      actionId === 'menu_showroom'
    ) {
      return {
        messages: [
          buildTextMessage(
            from,
            "📍 *Ayyan Fireworks – Visakhapatnam Showroom*\nMain Road/NH-16, Sheela Nagar, Visakhapatnam\n🗺️ Directions: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam"
          )
        ],
        metadata: { action: 'showroom_visit_sent' }
      };
    }

    // 3. Main Menu Navigation: Option 1 - Website
    if (
      actionId === 'btn_visit_website' ||
      actionId === 'btn_website' ||
      actionId === 'menu_website' ||
      actionId === '1'
    ) {
      return {
        messages: [
          buildTextMessage(
            from,
            "🌐 *Visit our official website & catalog:*\nhttps://vizagayyan.com"
          )
        ],
        metadata: { action: 'visit_website_sent' }
      };
    }

    // 4. Time-of-Day Quick Reply Buttons
    if (actionId === 'slot_morning') {
      return {
        messages: [
          buildTextMessage(
            from,
            '🌅 *Morning Window Selected (08:00 AM – 01:00 PM)*\n_Note: Special Diwali Season starts at 5:00 AM_\n\nTo complete your reservation and generate your VIP QR Pass, please confirm online or enter your name:'
          ),
          buildWebBookingCtaMessage(from, `${webUrl}/book-slot?window=morning`)
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
          buildWebBookingCtaMessage(from, `${webUrl}/book-slot?window=afternoon`)
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
          buildWebBookingCtaMessage(from, `${webUrl}/book-slot?window=evening`)
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
            `📍 *Ayyan Fireworks Flagship Showroom*\n\n🏢 *Address:* ${SHOWROOM_CONTACT.address}\n\n⏰ *Showroom Timings:*\n• *Regular Hours:* 8:00 AM – 10:00 PM\n• *Special Diwali Season Hours:* 5:00 AM – 10:00 PM (All 7 Days)\n\n🗺️ *Google Maps:* ${SHOWROOM_CONTACT.googleMapsUrl}\n\n📞 *Call / Desk:* ${SHOWROOM_CONTACT.phone}`
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

  // 1. Direct Greetings & Conversation Starters ("hi", "hello", "hey", etc.)
  // Directly dispatches fallback greeting text menu envelope
  if (
    normalizedText === 'hi' ||
    normalizedText === 'hello' ||
    normalizedText === 'hey' ||
    normalizedText === 'namaste' ||
    normalizedText === 'vanakkam' ||
    normalizedText === 'start' ||
    normalizedText === 'menu' ||
    normalizedText === 'help' ||
    normalizedText === 'welcome' ||
    normalizedText === ''
  ) {
    const envelope = buildFallbackGreetingTextMessage(from);
    return {
      messages: [envelope],
      metadata: { action: 'fallback_greeting_sent' }
    };
  }

  // Reply: View Catalogue Text (Priority matching)
  if (
    normalizedText === 'view catalogue' ||
    normalizedText.includes('view catalogue') ||
    normalizedText === 'catalogue' ||
    normalizedText === 'catalog' ||
    normalizedText.includes('catalogue') ||
    normalizedText.includes('catalog')
  ) {
    return {
      messages: [
        buildTextMessage(
          from,
          'Explore our full catalogue here: https://vizagayyan.com'
        )
      ],
      metadata: { fallbackTrigger: 'view_catalogue' }
    };
  }

  // Reply: PDF Price List & Catalog Document
  if (
    normalizedText.includes('pdf') ||
    normalizedText.includes('price list') ||
    normalizedText.includes('pricelist') ||
    normalizedText.includes('rate list') ||
    normalizedText.includes('rates') ||
    normalizedText.includes('download')
  ) {
    return {
      messages: [
        buildCatalogPdfDocumentMessage(from),
        buildTextMessage(
          from,
          `📄 Here is our official 2025-26 Ayyan Fireworks Price List PDF with 100% verified Sivakasi rates.\n\nDirect Download Link:\n👉 ${DEFAULT_PRICE_LIST_PDF_URL}\n\nBrowse live inventory online:\n👉 https://vizagayyan.com`
        )
      ],
      metadata: { fallbackTrigger: 'pdf_pricelist_document' }
    };
  }

  // Handling user text selection:
  switch (normalizedText) {
    case '1':
    case 'btn_visit_website':
      // Option 1 -> Website
      return {
        messages: [
          buildTextMessage(
            from,
            "🌐 *Visit our official website & catalog:*\nhttps://vizagayyan.com"
          )
        ],
        metadata: { fallbackTrigger: '1_visit_website' }
      };

    case '2':
    case 'btn_showroom_visit':
      // Option 2 -> Location
      return {
        messages: [
          buildTextMessage(
            from,
            "📍 *Ayyan Fireworks – Visakhapatnam Showroom*\nMain Road/NH-16, Sheela Nagar, Visakhapatnam\n🗺️ Directions: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam"
          )
        ],
        metadata: { fallbackTrigger: '2_location_store' }
      };

    // Keep slot booking hidden:
    /*
    case '3':
    case 'btn_book_slot':
      return {
        messages: [
          buildTextMessage(from, "🎟️ *Showroom Slot Booking:*\nhttps://vizagayyan.com")
        ],
        metadata: { fallbackTrigger: '3_book_vip_slot' }
      };
    */

    default:
      // Fallback AI query response or show main menu
      break;
  }

  // 1️⃣ Option 1: Website & Crackers / Pricing Queries
  if (
    normalizedText.includes('website') ||
    normalizedText.includes('web') ||
    normalizedText.includes('site') ||
    normalizedText.includes('online') ||
    normalizedText.includes('price') ||
    normalizedText.includes('pricing') ||
    normalizedText.includes('rate') ||
    normalizedText.includes('rates') ||
    normalizedText.includes('cracker') ||
    normalizedText.includes('crackers') ||
    normalizedText.includes('offer') ||
    normalizedText.includes('offers') ||
    normalizedText.includes('discount') ||
    normalizedText.includes('discounts') ||
    normalizedText.includes('deal') ||
    normalizedText.includes('deals') ||
    normalizedText.includes('query') ||
    normalizedText.includes('queries') ||
    normalizedText.includes('question') ||
    normalizedText.includes('questions')
  ) {
    return {
      messages: [
        buildTextMessage(
          from,
          "🌐 *Visit our official website & catalog:*\nhttps://vizagayyan.com"
        )
      ],
      metadata: { fallbackTrigger: '1_visit_website' }
    };
  }

  // 2️⃣ Option 2: Location of the Store
  if (
    normalizedText.includes('location') ||
    normalizedText.includes('address') ||
    normalizedText.includes('map') ||
    normalizedText.includes('directions') ||
    normalizedText.includes('where') ||
    normalizedText.includes('store') ||
    normalizedText.includes('branch') ||
    normalizedText.includes('showroom') ||
    normalizedText.includes('visit')
  ) {
    return {
      messages: [
        buildTextMessage(
          from,
          "📍 *Ayyan Fireworks – Visakhapatnam Showroom*\nMain Road/NH-16, Sheela Nagar, Visakhapatnam\n🗺️ Directions: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam"
        )
      ],
      metadata: { fallbackTrigger: '2_location_store' }
    };
  }

  // Reply: Showroom Timings & Hours Query
  if (
    normalizedText.includes('timing') ||
    normalizedText.includes('timings') ||
    normalizedText.includes('hours') ||
    normalizedText.includes('time') ||
    normalizedText.includes('open') ||
    normalizedText.includes('close') ||
    normalizedText.includes('schedule')
  ) {
    return {
      messages: [
        buildTextMessage(
          from,
          `⏰ *Ayyan Fireworks Showroom Timings*\n\n` +
          `Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
          `📍 *Showroom Location:* Sheela Nagar (NH-16), Visakhapatnam\n` +
          `🗺️ *Directions:* https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam\n` +
          `📞 *Helpline:* +91 77299 92125`
        )
      ],
      metadata: { fallbackTrigger: 'showroom_timings' }
    };
  }

  /*
  // Option 3: Slot Booking (Temporarily Hidden)
  if (
    normalizedText.includes('slot') ||
    normalizedText.includes('book') ||
    normalizedText.includes('ticket') ||
    normalizedText.includes('pass') ||
    normalizedText.includes('reservation') ||
    normalizedText.includes('vip')
  ) {
    return {
      messages: [
        buildTextMessage(from, "🎟️ *Showroom Slot Booking:*\nhttps://vizagayyan.com")
      ],
      metadata: { fallbackTrigger: '3_book_vip_slot' }
    };
  }
  */

  // Welcome Greeting Handler Fallback -> Fallback Greeting Text Message
  return {
    messages: [
      buildFallbackGreetingTextMessage(from)
    ],
    metadata: { fallbackTrigger: 'fallback_greeting_text' }
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

    let result: any;
    try {
      result = await response.json();
    } catch (_jsonErr) {
      const rawText = await response.text().catch(() => '');
      result = { rawBody: rawText };
    }

    if (!response.ok) {
      console.error('[WhatsApp Cloud API Error] FULL ERROR RESPONSE BODY FROM META:', JSON.stringify(result, null, 2));
      return {
        success: false,
        error: result?.error?.message || `HTTP ${response.status}: Failed to send WhatsApp message`,
        data: result
      };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error('[WhatsApp Cloud API Exception] FULL ERROR RESPONSE BODY / DETAILS:', err);
    return { success: false, error: err?.message || 'Network exception' };
  }
}

/**
 * Direct incoming greeting dispatch helper:
 * const envelope = buildFallbackGreetingTextMessage(senderPhone);
 * await sendWhatsAppCloudMessage(envelope);
 */
export async function sendFallbackGreetingMessage(
  senderPhone: string,
  config?: WhatsAppApiConfig
): Promise<{ success: boolean; data?: any; error?: string }> {
  const envelope = buildFallbackGreetingTextMessage(senderPhone);
  return sendWhatsAppCloudMessage(envelope, config);
}

// ============================================================================
// Helper Utilities
// ============================================================================

export function getNextDateStr(baseDateStr: string, dayOffset: number): string {
  try {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + dayOffset);
    return d.toISOString().split('T')[0];
  } catch (e) {
    return baseDateStr;
  }
}
