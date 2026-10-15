import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { processBookingSubmission } from './api/book-slot';

function bookSlotMiddlewarePlugin(): Plugin {
  return {
    name: 'book-slot-middleware',
    configureServer(server) {
      server.middlewares.use('/api/book-slot', (req, res, next) => {
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
              const result = await processBookingSubmission(body);
              res.statusCode = result.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.body));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Server Error' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), bookSlotMiddlewarePlugin()],
  server: {
    port: 5173,
    host: true
  }
});

