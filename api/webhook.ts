import { webhookController } from '../src/routes/webhook';

export default async function handler(req: any, res: any) {
  return webhookController(req, res);
}
