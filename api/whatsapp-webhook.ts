// api/whatsapp-webhook.ts
// Pure Node HTTP handler - requires NO external packages or @vercel/node

const VERIFY_TOKEN =
  process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
  process.env.WHATSAPP_VERIFY_TOKEN ||
  'ayyan_fireworks_secure_token_2026';

export default async function handler(req: any, res: any) {
  // Helper to safely send response across Vercel / Express / native Node HTTP
  const sendResponse = (statusCode: number, data: any) => {
    if (typeof res.status === 'function') {
      return res.status(statusCode).send(data);
    }
    res.statusCode = statusCode;
    if (typeof data === 'object') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(data));
    }
    return res.end(String(data));
  };

  // 1. Meta Webhook Verification Handshake (GET)
  if (req.method === 'GET') {
    const query = req.query || (req.url ? Object.fromEntries(new URL(req.url, 'http://localhost').searchParams.entries()) : {});
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully!');
      return sendResponse(200, challenge);
    }
    return sendResponse(403, 'Verification failed');
  }

  // 2. Incoming Messages Handler (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body;

      if (body?.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
          const from = message.from;
          console.log(`Received message from ${from}`);

          const replyText =
            `Welcome to Ayyan Fireworks, Visakhapatnam! 🎆\n\n` +
            `Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
            `Please select an option below:\n` +
            `1️⃣ Click 1 for Website: https://vizagayyan.com\n` +
            `2️⃣ Click 2 for Location of the Store: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam\n\n` +
            `Tell me your queries! You can also ask any question about our crackers, pricing, and offers.`;

          const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || value?.metadata?.phone_number_id;
          const apiToken = process.env.WHATSAPP_CLOUD_API_TOKEN;

          if (phoneId && apiToken) {
            await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: from,
                type: 'text',
                text: { preview_url: true, body: replyText },
              }),
            });
          }
        }
      }

      return sendResponse(200, 'EVENT_RECEIVED');
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return sendResponse(200, 'EVENT_RECEIVED');
    }
  }

  return sendResponse(405, 'Method Not Allowed');
}
