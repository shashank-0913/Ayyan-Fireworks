/**
 * WhatsApp Business Cloud API Webhook Receiver Router
 * Ayyan Fireworks (Bunny Brand)
 *
 * Handles incoming webhooks:
 * - GET: Hub challenge verification for Meta App Configuration
 * - POST: Inspects `message.type === "interactive"`
 *   - Extracts `message.interactive.button_reply.id`
 *   - Extracts `message.interactive.list_reply.id`
 *   - Dispatches matching action handlers (btn_book_slot, btn_location, btn_website, slot_*, etc.)
 *   - Maintains fallback handling for normal text messages.
 */

import {
  sendStoreLocation,
  sendTextMessage,
  sendWelcomeTemplate
} from '../services/whatsapp';
import { formatWhatsAppPhone } from '../lib/utils';

export interface WebhookQuery {
  'hub.mode'?: string;
  'hub.verify_token'?: string;
  'hub.challenge'?: string;
}

export interface WebhookMessageContext {
  from: string;
  senderName?: string;
  messageId: string;
  timestamp: string;
  type: string;
  buttonReplyId?: string;
  buttonReplyTitle?: string;
  listReplyId?: string;
  listReplyTitle?: string;
  textBody?: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
}

const VERIFY_TOKEN =
  (typeof process !== 'undefined' && (process.env?.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env?.WEBHOOK_VERIFY_TOKEN)) ||
  'ayyan_fireworks_secure_token_2026';

/**
 * 1. Webhook Verification Handler (GET)
 */
export function handleWebhookVerification(query: WebhookQuery): { status: number; body: string } {
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verification successful.');
    return { status: 200, body: challenge || 'OK' };
  }

  console.warn('[WhatsApp Webhook] Verification token mismatch or invalid mode.');
  return { status: 403, body: 'Forbidden' };
}

/**
 * 2. Incoming Event Message Parser
 */
export function parseIncomingMessage(body: any): WebhookMessageContext | null {
  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    const contact = change?.contacts?.[0];

    if (!message) return null;

    const from = formatWhatsAppPhone(message.from);
    const senderName = contact?.profile?.name;
    const messageId = message.id || `msg_${Date.now()}`;
    const timestamp = message.timestamp || String(Date.now());
    const type = message.type;

    const ctx: WebhookMessageContext = {
      from,
      senderName,
      messageId,
      timestamp,
      type
    };

    // Extract Interactive Button Reply or List Reply IDs
    if (type === 'interactive' && message.interactive) {
      if (message.interactive.type === 'button_reply' && message.interactive.button_reply) {
        ctx.buttonReplyId = message.interactive.button_reply.id;
        ctx.buttonReplyTitle = message.interactive.button_reply.title;
      } else if (message.interactive.type === 'list_reply' && message.interactive.list_reply) {
        ctx.listReplyId = message.interactive.list_reply.id;
        ctx.listReplyTitle = message.interactive.list_reply.title;
      }
    } else if (type === 'button' && message.button) {
      // Legacy template button
      ctx.buttonReplyId = message.button.payload || message.button.text;
      ctx.buttonReplyTitle = message.button.text;
    } else if (type === 'text' && message.text) {
      ctx.textBody = message.text.body?.trim();
    } else if (type === 'location' && message.location) {
      ctx.location = message.location;
    }

    return ctx;
  } catch (err) {
    console.error('[WhatsApp Webhook] Error parsing payload:', err);
    return null;
  }
}

/**
 * 3. Webhook Message Event Router (POST)
 */
export async function handleWebhookMessage(parsed: WebhookMessageContext): Promise<{ success: boolean; handledAction: string }> {
  const { from, senderName: _senderName, buttonReplyId, listReplyId, textBody, type } = parsed;
  const actionId = buttonReplyId || listReplyId;

  console.log(`[WhatsApp Webhook Router] Message from ${from} | Type: ${type} | ActionID: ${actionId || 'none'}`);

  // ==========================================================================
  // A. INTERACTIVE COMPONENT ACTION ID ROUTING
  // ==========================================================================
  if (actionId) {
    // 1. Main Menu Button 1: Book VIP Slot
    if (actionId === 'btn_book_slot') {
      await sendTextMessage(
        from,
        `✨ Reserve your VIP Showroom visiting slot here:\n👉 https://vizagayyan.com/#booking`
      );
      return { success: true, handledAction: 'btn_book_slot' };
    }

    // 2. Main Menu Button 2: Visit Website
    if (actionId === 'btn_visit_website' || actionId === 'btn_website') {
      await sendTextMessage(
        from,
        `🎆 Explore our full Sivakasi cracker collection and price list:\n👉 https://vizagayyan.com`
      );
      return { success: true, handledAction: 'btn_visit_website' };
    }

    // 3. Main Menu Button 3: Showroom Visit
    if (actionId === 'btn_showroom_visit' || actionId === 'btn_showroom' || actionId === 'btn_location') {
      await sendTextMessage(
        from,
        `📍 Visit our Ayyan Fireworks Showroom in Visakhapatnam:\n👉 https://maps.app.goo.gl/agWQFufKjWkwFbVs7`
      );
      return { success: true, handledAction: 'btn_showroom_visit' };
    }

    // 4. Time Slot Selection Rows (from interactive list)
    if (actionId === 'slot_morning') {
      await sendTextMessage(
        from,
        `🌅 *Morning Slot Reserved (08:00 AM – 01:00 PM)*\n_Note: Special Diwali Season starts at 5:00 AM_\n\nTo lock your VIP gate pass and avoid queue wait times, please complete your reservation details:\n👉 https://vizagayyan.com/book-slot?window=morning`
      );
      return { success: true, handledAction: 'slot_morning' };
    }

    if (actionId === 'slot_afternoon') {
      await sendTextMessage(
        from,
        `☀️ *Afternoon Slot Reserved (01:00 PM – 05:00 PM)*\n\nIndoor showroom shopping with dedicated customer support. Complete reservation details:\n👉 https://vizagayyan.com/book-slot?window=afternoon`
      );
      return { success: true, handledAction: 'slot_afternoon' };
    }

    if (actionId === 'slot_evening') {
      await sendTextMessage(
        from,
        `🌙 *Evening Spectacle Slot Reserved (05:00 PM – 10:00 PM)*\n\nIncludes live outdoor fireworks demonstration. Complete reservation details:\n👉 https://vizagayyan.com/book-slot?window=evening`
      );
      return { success: true, handledAction: 'slot_evening' };
    }

    if (actionId === 'slot_vip_instant') {
      await sendTextMessage(
        from,
        `🎟️ *VIP Instant Pass*\n\nGet direct entrance gate admission for today:\n👉 https://vizagayyan.com/book-slot?type=instant`
      );
      return { success: true, handledAction: 'slot_vip_instant' };
    }
  }

  // ==========================================================================
  // B. USER SHARED LIVE LOCATION
  // ==========================================================================
  if (type === 'location') {
    await sendStoreLocation(from);
    return { success: true, handledAction: 'location_shared' };
  }

  // ==========================================================================
  // C. FALLBACK HANDLING FOR STANDARD TEXT MESSAGES
  // Ordered by 1. Book VIP Slot, 2. Visit Website, 3. Showroom Visit
  // ==========================================================================
  const text = (textBody || '').trim().toLowerCase();

  // 1. Direct Greetings ("hi", "hello", "hey", etc.) -> Send Approved Meta Template
  if (
    text === 'hi' ||
    text === 'hello' ||
    text === 'hey' ||
    text === 'start' ||
    text === 'menu' ||
    text === 'namaste' ||
    text === 'vanakkam' ||
    text === 'welcome' ||
    text === ''
  ) {
    await sendWelcomeTemplate(from);
    return { success: true, handledAction: 'welcome_template_ayyan_welcome_v2' };
  }

  // 2. Text number "1" or keyword "slot" / "book" / "vip" / "pass"
  if (text === '1' || text.includes('slot') || text.includes('book') || text.includes('ticket') || text.includes('pass') || text.includes('vip')) {
    await sendTextMessage(
      from,
      `✨ Reserve your VIP Showroom visiting slot here:\n👉 https://vizagayyan.com/#booking`
    );
    return { success: true, handledAction: 'fallback_text_slot' };
  }

  // 3. Text number "2" or keyword "website" / "catalogue" / "price" / "online"
  if (text === '2' || text.includes('website') || text.includes('catalogue') || text.includes('catalog') || text.includes('price') || text.includes('online')) {
    await sendTextMessage(
      from,
      `🎆 Explore our full Sivakasi cracker collection and price list:\n👉 https://vizagayyan.com`
    );
    return { success: true, handledAction: 'fallback_text_website' };
  }

  // 4. Text number "3" or keyword "showroom" / "location" / "address" / "map" / "where" / "visit"
  if (text === '3' || text.includes('showroom') || text.includes('visit') || text.includes('location') || text.includes('address') || text.includes('map') || text.includes('where')) {
    await sendTextMessage(
      from,
      `📍 Visit our Ayyan Fireworks Showroom in Visakhapatnam:\n👉 https://maps.app.goo.gl/agWQFufKjWkwFbVs7`
    );
    return { success: true, handledAction: 'fallback_text_location' };
  }

  // 5. Fallback -> Send Approved Meta Template directly
  await sendWelcomeTemplate(from);
  return { success: true, handledAction: 'fallback_welcome_template' };
}

/**
 * 4. Express / Serverless Webhook Controller Handler
 */
export async function webhookController(req: any, res: any) {
  const method = req.method || 'GET';
  console.log(`[WhatsApp Webhook Controller] Incoming HTTP ${method} request received`);

  if (method === 'GET') {
    const query = req.query || {};
    console.log('[WhatsApp Webhook Controller] Verification query params:', query);
    const result = handleWebhookVerification(query);
    console.log(`[WhatsApp Webhook Controller] Verification response status: ${result.status}`);
    res.status(result.status);
    return typeof result.body === 'string' ? res.send(result.body) : res.json(result.body);
  }

  if (method === 'POST') {
    console.log('[WhatsApp Webhook Controller] Raw POST body:', JSON.stringify(req.body, null, 2));
    const parsed = parseIncomingMessage(req.body);

    if (!parsed) {
      console.log('[WhatsApp Webhook Controller] Non-message event or delivery status update received. Acknowledged with HTTP 200.');
      return res.status(200).json({ status: 'ignored_non_message' });
    }

    console.log(`[WhatsApp Webhook Controller] 📨 INCOMING MESSAGE:
      From: ${parsed.from}
      Sender: ${parsed.senderName || 'Anonymous'}
      Type: ${parsed.type}
      Button Reply ID: ${parsed.buttonReplyId || 'none'}
      Button Reply Title: ${parsed.buttonReplyTitle || 'none'}
      List Reply ID: ${parsed.listReplyId || 'none'}
      List Reply Title: ${parsed.listReplyTitle || 'none'}
      Text Body: ${parsed.textBody || 'none'}
    `);

    try {
      const response = await handleWebhookMessage(parsed);
      console.log(`[WhatsApp Webhook Controller] Action processed successfully: "${response.handledAction}". Responding with HTTP 200.`);
      return res.status(200).json(response);
    } catch (err: any) {
      console.error('[WhatsApp Webhook Controller Error]:', err);
      return res.status(500).json({ error: err?.message || 'Processing error' });
    }
  }

  console.warn(`[WhatsApp Webhook Controller] Unhandled HTTP method: ${method}`);
  return res.status(405).json({ error: 'Method not allowed' });
}
