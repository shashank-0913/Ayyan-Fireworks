import {
  handleWhatsAppWebhookEvent,
  buildMainMenuMessage,
  buildWelcomeTemplateMessage,
  WhatsAppButtonInteractive
} from '../src/lib/whatsappBot';
import {
  WHATSAPP_INTERACTIVE_OPTIONS,
  DEFAULT_WEBSITE_URL,
  BOT_RESPONSES,
  buildWelcomeGreetingPayload
} from '../src/lib/whatsappWebhookHandler';

async function test() {
  console.log('DEFAULT WEBSITE URL:', DEFAULT_WEBSITE_URL);
  console.log('OPTIONS:', JSON.stringify(WHATSAPP_INTERACTIVE_OPTIONS, null, 2));

  // 1. Test Welcome Greeting Template Payload
  const welcomePayload = buildWelcomeGreetingPayload('917729992125');
  console.log('\n--- APPROVED WELCOME TEMPLATE PAYLOAD ---');
  console.log(JSON.stringify(welcomePayload, null, 2));

  // 2. Interactive Menu
  const menu = buildMainMenuMessage('917729992125');
  console.log('\n--- MAIN MENU BUTTONS ---');

  // Narrow or cast action type to access action.buttons without type error
  if (menu.interactive && menu.interactive.type === 'button') {
    const buttonInteractive = menu.interactive as WhatsAppButtonInteractive;
    buttonInteractive.action.buttons.forEach((b, idx: number) => {
      console.log(` Button ${idx + 1}: ID: "${b.reply.id}" | Title: "${b.reply.title}"`);
    });
  }

  console.log('\n--- BUTTON TAP RESPONSES ---');

  // Test: View Catalogue button tap
  const bCatalogue = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm_cat',
    timestamp: '1',
    type: 'interactive',
    actionId: 'view_catalogue',
    actionTitle: 'View Catalogue',
    rawPayload: {}
  });
  console.log('Tap [View Catalogue]:\n' + bCatalogue.messages[0]?.text?.body);

  // Test: Button 1: btn_book_slot
  const b1 = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm1',
    timestamp: '2',
    type: 'interactive',
    actionId: 'btn_book_slot',
    rawPayload: {}
  });
  console.log('\nTap [btn_book_slot]:\n' + b1.messages[0]?.text?.body);

  // Test: Button 2: btn_visit_website
  const b2 = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm2',
    timestamp: '3',
    type: 'interactive',
    actionId: 'btn_visit_website',
    rawPayload: {}
  });
  console.log('\nTap [btn_visit_website]:\n' + b2.messages[0]?.text?.body);

  // Test: Button 3: btn_showroom_visit
  const b3 = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm3',
    timestamp: '4',
    type: 'interactive',
    actionId: 'btn_showroom_visit',
    rawPayload: {}
  });
  console.log('\nTap [btn_showroom_visit]:\n' + b3.messages[0]?.text?.body);

  console.log('\n--- TEXT REPLIES ---');

  // Text: "View Catalogue"
  const tCat = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm_tcat',
    timestamp: '5',
    type: 'text',
    textBody: 'View Catalogue',
    rawPayload: {}
  });
  console.log('Reply "View Catalogue":\n' + tCat.messages[0]?.text?.body);

  // Text: "Hi" (triggers welcome greeting template)
  const tGreeting = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm_hi',
    timestamp: '6',
    type: 'text',
    textBody: 'Hi',
    rawPayload: {}
  });
  console.log('\nReply "Hi" (Welcome Greeting Template Response):\n' + JSON.stringify(tGreeting.messages[0], null, 2));

  // Text: "hello"
  const tHello = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm_hello',
    timestamp: '7',
    type: 'text',
    textBody: 'hello',
    rawPayload: {}
  });
  console.log('\nReply "hello" (Welcome Greeting Template Response):\n' + JSON.stringify(tHello.messages[0], null, 2));

  // Text: Generic greeting / starter
  const tStarter = await handleWhatsAppWebhookEvent({
    from: '917729992125',
    messageId: 'm_start',
    timestamp: '8',
    type: 'text',
    textBody: 'start',
    rawPayload: {}
  });
  console.log('\nReply "start" (Welcome Greeting Template Response):\n' + JSON.stringify(tStarter.messages[0], null, 2));
}

test().catch(console.error);
