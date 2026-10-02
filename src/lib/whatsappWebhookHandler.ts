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
  ParsedIncomingWhatsAppMessage
} from './whatsappBot';

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
        websiteUrl: options?.websiteUrl,
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
