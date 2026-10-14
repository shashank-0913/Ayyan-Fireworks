import fs from 'fs';
import path from 'path';

// 1. Manually parse .env file
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (m) {
          const key = m[1];
          let val = (m[2] || '').trim();
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          if (!process.env[key]) process.env[key] = val;
        }
      });
    }
  } catch (err) {}
}

loadEnv();

const args = process.argv.slice(2);
let recipient = args.find(a => !a.startsWith('--')) || process.env.VITE_WHATSAPP_NUMBER || '917729992125';

// Optional override flags: --phone-id=..., --token=..., --msg=...
let phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
let token = process.env.WHATSAPP_CLOUD_API_TOKEN;
let customMsg = 'Ayyan Fireworks bot diagnostic test';

for (const arg of args) {
  if (arg.startsWith('--phone-id=')) phoneId = arg.split('=')[1];
  if (arg.startsWith('--token=')) token = arg.split('=')[1];
  if (arg.startsWith('--msg=')) customMsg = arg.split('=')[1];
  if (arg.startsWith('--to=')) recipient = arg.split('=')[1];
}

recipient = recipient.replace(/[^\d]/g, '');

console.log('================================================================');
console.log('   AYYAN FIREWORKS — WHATSAPP CLOUD API DIAGNOSTIC TEST (v21.0) ');
console.log('================================================================');
console.log(`• Phone Number ID : ${phoneId ? phoneId : '(MISSING - check .env)'}`);
console.log(`• Cloud API Token : ${token ? token.slice(0, 10) + '...' + token.slice(-5) : '(MISSING - check .env)'}`);
console.log(`• Recipient Number: ${recipient}`);
console.log(`• Message Body    : "${customMsg}"`);
console.log('----------------------------------------------------------------');

if (!phoneId || phoneId.includes('your_whatsapp_phone_number_id')) {
  console.error('\n❌ ERROR: WHATSAPP_PHONE_NUMBER_ID is not set in .env.');
  console.error('Please add your Meta Phone Number ID to .env or pass --phone-id=<id>');
  process.exit(1);
}

if (!token || token.includes('your_meta_system_user_access_token')) {
  console.error('\n❌ ERROR: WHATSAPP_CLOUD_API_TOKEN is not set in .env.');
  console.error('Please add your Meta Permanent System User Token to .env or pass --token=<token>');
  process.exit(1);
}

const endpoint = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

const payload = {
  messaging_product: 'whatsapp',
  to: recipient,
  type: 'text',
  text: { body: customMsg }
};

async function sendDiagnostic() {
  console.log(`📡 Sending POST request to Meta endpoint: ${endpoint} ...\n`);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const statusText = `${res.status} ${res.statusText}`;
    const data = await res.json();

    if (res.ok) {
      console.log(`✅ SUCCESS! Meta HTTP Status: ${statusText}`);
      console.log('Server Response:');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n📲 Message ID:', data.messages?.[0]?.id || 'N/A');
      console.log('The diagnostic message has been handed off to WhatsApp delivery network.');
    } else {
      console.error(`❌ FAILED! Meta HTTP Status: ${statusText}`);
      console.error('Error Details:');
      console.error(JSON.stringify(data, null, 2));

      if (data.error?.code === 190) {
        console.error('\n💡 HINT: Error 190 means the Access Token is invalid or expired.');
      } else if (data.error?.code === 131030) {
        console.error('\n💡 HINT: Recipient phone number is not registered or not in the test allowed numbers list.');
      } else if (data.error?.code === 131047) {
        console.error('\n💡 HINT: More than 24 hours have passed since the recipient last messaged you. Free-form text messages require an active 24-hour window, or you must use an approved template.');
      }
    }
  } catch (err) {
    console.error('❌ Network Exception:', err.message);
  }
}

sendDiagnostic();
