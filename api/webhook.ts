import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERIFY_TOKEN =
  process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
  process.env.WHATSAPP_VERIFY_TOKEN ||
  'ayyan_fireworks_secure_token_2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Meta Webhook Verification Handshake (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully!');
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verification failed');
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
          console.log(`Received message from ${from}:`, message.text?.body || message.type);

          const rawText = (message.text?.body || message.interactive?.button_reply?.id || '').trim().toLowerCase();

          // Build your two-option text greeting or handle direct numbered selections
          let replyText =
            `Welcome to Ayyan Fireworks, Visakhapatnam! 🎆\n\n` +
            `Showroom Timings: 8:00 AM – 10:00 PM (5:00 AM – 10:00 PM during Diwali Season)\n\n` +
            `Please select an option below:\n` +
            `1️⃣ Click 1 for Website: https://vizagayyan.com\n` +
            `2️⃣ Click 2 for Location of the Store: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam\n\n` +
            `Tell me your queries! You can also ask any question about our crackers, pricing, and offers.`;

          if (rawText === '1' || rawText === 'btn_visit_website') {
            replyText = `🌐 *Visit our official website & catalog:*\nhttps://vizagayyan.com`;
          } else if (rawText === '2' || rawText === 'btn_showroom_visit') {
            replyText = `📍 *Ayyan Fireworks – Visakhapatnam Showroom*\nMain Road/NH-16, Sheela Nagar, Visakhapatnam\n🗺️ Directions: https://maps.google.com/?q=Ayyan+Fireworks+Visakhapatnam`;
          }

          const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || value?.metadata?.phone_number_id;
          const apiToken = process.env.WHATSAPP_CLOUD_API_TOKEN;

          if (phoneId && apiToken) {
            await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiToken}`,
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

      return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return res.status(200).send('EVENT_RECEIVED');
    }
  }

  return res.status(405).send('Method Not Allowed');
}
