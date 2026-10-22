/**
 * WhatsApp Business Cloud API Webhook Controller
 * Ayyan Fireworks (Bunny Brand)
 *
 * Provides standard HTTP request handler for webhook subscription verification & incoming message processing.
 */

import {
  parseWhatsAppWebhookPayload,
  handleWhatsAppWebhookEvent,
  sendWhatsAppCloudMessage,
  buildMainMenuMessage,
  buildFallbackGreetingTextMessage,
  buildSlotTimeOfDayButtonMessage,
  buildBranchLocationsListMessage,
  buildDateSelectionListMessage,
  buildWebBookingCtaMessage,
  buildCatalogueCtaMessage,
  buildLocationRequestInteractiveMessage,
  buildBookingConfirmationInteractiveMessage,
  buildTextMessage,
  buildWelcomeTemplateMessage,
  sendFallbackGreetingMessage,
  ParsedIncomingWhatsAppMessage,
  WhatsAppBotResponse,
  WhatsAppMessageEnvelope,
  WhatsAppButtonInteractive,
  WhatsAppTemplatePayload
} from './whatsappBot';

export {
  parseWhatsAppWebhookPayload,
  handleWhatsAppWebhookEvent,
  sendWhatsAppCloudMessage,
  sendFallbackGreetingMessage,
  buildMainMenuMessage,
  buildFallbackGreetingTextMessage,
  buildSlotTimeOfDayButtonMessage,
  buildBranchLocationsListMessage,
  buildDateSelectionListMessage,
  buildWebBookingCtaMessage,
  buildCatalogueCtaMessage,
  buildLocationRequestInteractiveMessage,
  buildBookingConfirmationInteractiveMessage,
  buildTextMessage,
  buildWelcomeTemplateMessage
};

export type {
  ParsedIncomingWhatsAppMessage,
  WhatsAppBotResponse,
  WhatsAppMessageEnvelope,
  WhatsAppButtonInteractive,
  WhatsAppTemplatePayload
};

/** Default website URL for slot booking and pass verification links */
export const DEFAULT_WEBSITE_URL = 'https://vizagayyan.com';
export const SLOT_BOOKING_URL = 'https://vizagayyan.com/#booking';
export const PASS_MANAGEMENT_URL = 'https://vizagayyan.com/my-bookings';

/** Approved Meta WhatsApp Template name for welcome greeting menu */
export const WELCOME_TEMPLATE_NAME = 'ayyan_menu_v2';

/** Reply text when user clicks "View Catalogue" or sends catalogue enquiry */
export const CATALOGUE_REPLY_TEXT = 'Explore our full catalogue here: https://vizagayyan.com';

/**
 * Builds the approved Meta WhatsApp welcome greeting template payload:
 * {
 *   "messaging_product": "whatsapp",
 *   "recipient_type": "individual",
 *   "to": recipientPhone,
 *   "type": "template",
 *   "template": {
 *     "name": "ayyan_menu_v2",
 *     "language": {
 *       "code": "en"
 *     }
 *   }
 * }
 */
export function buildWelcomeGreetingPayload(
  toPhone: string,
  templateName: string = WELCOME_TEMPLATE_NAME
): WhatsAppMessageEnvelope {
  return buildWelcomeTemplateMessage(toPhone, templateName);
}

/**
 * Immediate reply text responses for button taps:
 * - View Catalogue: Full online catalogue link
 * - btn_book_slot: VIP Slot reservation link
 * - btn_showroom_visit: Showroom address, timings, and Google Maps link
 * - btn_visit_website: Full collection & price list link
 */
export const BOT_RESPONSES = {
  VIEW_CATALOGUE: CATALOGUE_REPLY_TEXT,
  BOOK_SLOT: `🎟️ *Showroom Slot Booking:*\nhttps://vizagayyan.com`,
  LOCATION_STORE: `📍 *Ayyan Fireworks – Visakhapatnam Showroom*\nMain Road/NH-16, Sheela Nagar, Visakhapatnam\n🗺️ Directions: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam`,
  SHOWROOM_VISIT: `📍 *Ayyan Fireworks – Visakhapatnam Showroom*\nMain Road/NH-16, Sheela Nagar, Visakhapatnam\n🗺️ Directions: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam`,
  VISIT_WEBSITE: `🌐 *Visit our official website & catalog:*\nhttps://vizagayyan.com`
} as const;

/**
 * 2 Interactive Main Menu Reply Options Setup:
 * 1. Visit Website (id: "btn_visit_website")
 * 2. Store Location (id: "btn_showroom_visit")
 */
export const WHATSAPP_INTERACTIVE_OPTIONS = [
  {
    replyNumber: '1',
    id: 'btn_visit_website',
    title: 'Visit Website',
    description: 'Explore our full Sivakasi cracker collection, pricing, and offers'
  },
  {
    replyNumber: '2',
    id: 'btn_showroom_visit',
    title: 'Store Location',
    description: 'Ayyan Fireworks Showroom address, directions & store timings'
  }
] as const;

/** Fallback greeting text message */
export const FALLBACK_GREETING_TEXT =
  `Welcome to Ayyan Fireworks, Visakhapatnam! 🎆\n\n` +
  `Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
  `Please select an option below:\n` +
  `1️⃣ Click 1 for Website\n` +
  `2️⃣ Click 2 for Location of the Store\n\n` +
  `Tell me your queries! You can also ask any question about our crackers, pricing, and offers.`;

export interface WebhookHttpRequest {
  method: string;
  query?: Record<string, string | undefined>;
  body?: any;
  headers?: Record<string, string | undefined>;
}

export interface WebhookHttpResponse {
  status: number;
  body: any;
  headers?: Record<string, string>;
}

/**
 * Controller for handling WhatsApp Cloud API Webhooks.
 * - GET: Hub challenge verification (for Meta App Dashboard webhook config)
 * - POST: Incoming message events (interactive button_reply, list_reply, location, and text)
 */
export async function handleWhatsAppWebhookRequest(
  req: WebhookHttpRequest,
  options?: {
    verifyToken?: string;
    websiteUrl?: string;
    supabaseClient?: any;
  }
): Promise<WebhookHttpResponse> {
  const verifyToken =
    options?.verifyToken ||
    (typeof process !== 'undefined' &&
      (process.env?.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
        process.env?.WHATSAPP_VERIFY_TOKEN ||
        process.env?.WEBHOOK_VERIFY_TOKEN)) ||
    'ayyan_fireworks_secure_token_2026';

  const websiteUrl = options?.websiteUrl || DEFAULT_WEBSITE_URL;

  // 1. GET Request: Meta Webhook Subscription Verification
  if (req.method === 'GET') {
    const mode = req.query?.['hub.mode'];
    const token = req.query?.['hub.verify_token'];
    const challenge = req.query?.['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WhatsApp Webhook] Subscription verified successfully!');
      return {
        status: 200,
        body: challenge || 'OK',
        headers: { 'Content-Type': 'text/plain' }
      };
    }

    console.warn('[WhatsApp Webhook] Verification failed: Token mismatch or invalid mode.');
    return {
      status: 403,
      body: { error: 'Verification failed' }
    };
  }

  // 2. POST Request: Incoming Message Event
  if (req.method === 'POST') {
    const parsedEvent: ParsedIncomingWhatsAppMessage | null = parseWhatsAppWebhookPayload(req.body);

    if (!parsedEvent) {
      // Return 200 to acknowledge delivery receipts or non-message events
      return {
        status: 200,
        body: { status: 'acknowledged_non_message_or_empty' }
      };
    }

    console.log(`[WhatsApp Webhook] Received ${parsedEvent.type} message from ${parsedEvent.from}:`, {
      actionId: parsedEvent.actionId,
      textBody: parsedEvent.textBody
    });

    try {
      // Route event to get bot responses
      const botResponse = await handleWhatsAppWebhookEvent(parsedEvent, {
        websiteUrl,
        supabaseClient: options?.supabaseClient
      });

      // Dispatch outgoing messages back to the user
      for (const msg of botResponse.messages) {
        const dispatchResult = await sendWhatsAppCloudMessage(msg);
        if (!dispatchResult.success) {
          console.error('[WhatsApp Webhook Dispatch Error] FULL ERROR RESPONSE BODY FROM META:', JSON.stringify(dispatchResult.data || dispatchResult.error, null, 2));
        }
      }

      return {
        status: 200,
        body: {
          success: true,
          action: parsedEvent.actionId || 'text_fallback',
          dispatchedCount: botResponse.messages.length
        }
      };
    } catch (err: any) {
      console.error('[WhatsApp Webhook] Processing error - FULL ERROR BODY FROM META/SERVER:', err);
      return {
        status: 500,
        body: { error: 'Failed to process incoming webhook event', details: err?.message, fullError: err }
      };
    }
  }

  return {
    status: 405,
    body: { error: 'Method Not Allowed' }
  };
}
