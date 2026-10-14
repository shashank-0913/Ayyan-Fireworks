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
  buildSlotTimeOfDayButtonMessage,
  buildBranchLocationsListMessage,
  buildDateSelectionListMessage,
  buildWebBookingCtaMessage,
  buildCatalogueCtaMessage,
  buildLocationRequestInteractiveMessage,
  buildBookingConfirmationInteractiveMessage,
  buildTextMessage,
  buildWelcomeTemplateMessage,
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
  buildMainMenuMessage,
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
export const WELCOME_TEMPLATE_NAME = 'ayyan_welcome_menu';

/** Reply text when user clicks "View Catalogue" or sends catalogue enquiry */
export const CATALOGUE_REPLY_TEXT = 'Explore our full catalogue here: https://vizagayyan.com';

/**
 * Builds the approved Meta WhatsApp welcome greeting template payload:
 * {
 *   "messaging_product": "whatsapp",
 *   "to": from,
 *   "type": "template",
 *   "template": {
 *     "name": "ayyan_welcome_menu",
 *     "language": {
 *       "code": "en"
 *     }
 *   }
 * }
 */
export function buildWelcomeGreetingPayload(toPhone: string): WhatsAppMessageEnvelope {
  return buildWelcomeTemplateMessage(toPhone);
}

/**
 * Immediate reply text responses for button taps:
 * - View Catalogue: Full online catalogue link
 * - btn_book_slot: VIP Slot reservation link
 * - btn_visit_website: Full collection & price list link
 * - btn_showroom_visit: Google Maps showroom link
 */
export const BOT_RESPONSES = {
  VIEW_CATALOGUE: CATALOGUE_REPLY_TEXT,
  BOOK_SLOT: `✨ Reserve your VIP Showroom visiting slot here:\n👉 https://vizagayyan.com/#booking`,
  VISIT_WEBSITE: `🎆 Explore our full Sivakasi cracker collection and price list:\n👉 https://vizagayyan.com`,
  SHOWROOM_VISIT: `📍 Visit our Ayyan Fireworks Showroom in Visakhapatnam:\n👉 https://maps.app.goo.gl/agWQFufKjWkwFbVs7`
} as const;

/**
 * 3 Interactive Main Menu Reply Buttons Setup:
 * 1. Book VIP Slot (id: "btn_book_slot")
 * 2. Visit Website (id: "btn_visit_website")
 * 3. Showroom Visit (id: "btn_showroom_visit")
 */
export const WHATSAPP_INTERACTIVE_OPTIONS = [
  {
    replyNumber: '1',
    id: 'btn_book_slot',
    title: 'Book VIP Slot',
    description: 'Reserve your VIP Showroom visiting slot'
  },
  {
    replyNumber: '2',
    id: 'btn_visit_website',
    title: 'Visit Website',
    description: 'Explore our full Sivakasi cracker collection and price list'
  },
  {
    replyNumber: '3',
    id: 'btn_showroom_visit',
    title: 'Showroom Visit',
    description: 'Ayyan Fireworks Showroom address & Google Maps navigation'
  }
] as const;

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
    (typeof process !== 'undefined' && (process.env?.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env?.WEBHOOK_VERIFY_TOKEN)) ||
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

      // Dispatch outgoing interactive messages back to the user
      for (const msg of botResponse.messages) {
        await sendWhatsAppCloudMessage(msg);
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
      console.error('[WhatsApp Webhook] Processing error:', err);
      return {
        status: 500,
        body: { error: 'Failed to process incoming webhook event', details: err?.message }
      };
    }
  }

  return {
    status: 405,
    body: { error: 'Method Not Allowed' }
  };
}
