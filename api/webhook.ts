import { handleWhatsAppWebhookRequest } from '../src/lib/whatsappWebhookHandler';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);

  // GET verification handshake from Meta
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const verifyToken =
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
      process.env.WHATSAPP_VERIFY_TOKEN ||
      'ayyan_fireworks_secure_token_2026';

    if (mode === 'subscribe' && token === verifyToken) {
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return new Response('Verification failed', { status: 403 });
  }

  // POST incoming messages
  if (req.method === 'POST') {
    try {
      const body = await req.json().catch(() => ({}));

      // Execute message handling logic
      await handleWhatsAppWebhookRequest({
        method: 'POST',
        body,
        query: Object.fromEntries(url.searchParams.entries()),
        headers: Object.fromEntries(req.headers.entries()),
      });

      return new Response('EVENT_RECEIVED', { status: 200 });
    } catch (err: any) {
      console.error('[WhatsApp Webhook Edge] Processing error:', err);
      // Meta requires 200 OK to prevent re-delivery storms
      return new Response('EVENT_RECEIVED', { status: 200 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
