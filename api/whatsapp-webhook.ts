import type { IncomingMessage, ServerResponse } from 'http';
import { handleWhatsAppWebhookRequest } from '../src/lib/whatsappWebhookHandler';

/**
 * Serverless / Edge Webhook Endpoint for WhatsApp Cloud API
 * Handles GET (Meta Verification) and POST (Interactive & Text message events)
 */
export default async function handler(req: any, res: any) {
  const method = req.method || 'GET';
  const query = req.query || {};
  const body = req.body || {};

  const result = await handleWhatsAppWebhookRequest({
    method,
    query,
    body,
    headers: req.headers
  });

  if (result.headers) {
    Object.entries(result.headers).forEach(([key, val]) => {
      res.setHeader(key, val);
    });
  }

  res.status(result.status);
  if (typeof result.body === 'string') {
    return res.send(result.body);
  }
  return res.json(result.body);
}
