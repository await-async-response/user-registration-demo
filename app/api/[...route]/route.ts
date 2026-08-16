import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '../auth';

const app = new Hono().basePath('/api');

app.route('/auth', auth);

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!'
  });
});

export const GET = handle(app);
export const POST = handle(app);
