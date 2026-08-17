import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import "reflect-metadata";
import auth from '../auth';
import user from '../user';
import { AppDataSource } from '../data-source';

const app = new Hono().basePath('/api');

try {
  await AppDataSource.initialize();
} catch (error) {
  console.log(error);
}

app.route('/auth', auth);
app.route('/user', user);

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!'
  });
});

export const GET = handle(app);
export const POST = handle(app);
