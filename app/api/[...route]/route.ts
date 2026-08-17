import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '../auth';
import user from '../user';

export const runtime = "nodejs";

const app = new Hono().basePath('/api');

app.route('/auth', auth);
app.route('/user', user);

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!'
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
