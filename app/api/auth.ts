import { Hono } from 'hono';

const auth = new Hono();

auth.post('/register', async (c) => {
  const { username, password } = await c.req.json();
});

export default auth;