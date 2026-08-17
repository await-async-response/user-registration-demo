import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { zValidator } from './util/validator-wrapper';
import { hashPassword, verifyPassword } from './util/password';
import { getDataSource } from './data-source';
import { User } from './entities/User';

const auth = new Hono();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN_SECONDS = 60 * 60 * 8; // 8 hours
export const AUTH_COOKIE_NAME = 'auth_token';

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

auth.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, firstName, lastName } = c.req.valid('json');
  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository<User>("User");

  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    return c.json({ error: { message: 'Email is already registered' } }, 400);
  }

  const user = userRepository.create({
    email,
    password: await hashPassword(password),
    firstName,
    lastName,
  });
  await userRepository.save(user);

  return c.json({
    message: 'User registered successfully',
    data: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

auth.post('/login', zValidator('json', loginSchema), async (c) => {
  if (!JWT_SECRET) {
    throw new HTTPException(500, { message: 'JWT_SECRET is not configured' });
  }

  const { email, password } = c.req.valid('json');
  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository<User>("User");

  const user = await userRepository.findOne({
    where: { email },
    select: { id: true, email: true, password: true },
  });
  if (!user || !(await verifyPassword(password, user.password))) {
    return c.json({ error: { message: 'Invalid email or password' } }, 401);
  }

  const token = await sign({
    sub: String(user.id),
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN_SECONDS,
  }, JWT_SECRET);

  setCookie(c, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    path: '/',
    maxAge: JWT_EXPIRES_IN_SECONDS,
  });

  return c.json({
    message: 'Login successful',
  });
});

auth.all('/logout', (c) => {
  deleteCookie(c, AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
  return c.json({
    message: 'Logout successful',
  });
});

auth.get('/', async (c) => {
  const token = getCookie(c, AUTH_COOKIE_NAME);
  if (!token) {
    return c.json({ error: { message: 'Not authenticated' } }, 401);
  }

  return c.json({
    message: 'Authenticated',
  });
});

export default auth;