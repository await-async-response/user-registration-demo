import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from './util/validator-wrapper';

const auth = new Hono();

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

auth.post('/register', zValidator('json', schema), async (c) => {
  const { email, password, firstName, lastName } = c.req.valid('json');
  console.log('User registered:', { email, firstName, lastName });

  return c.json({
    message: 'User registered successfully',
    data: {
      email,
      firstName,
      lastName,
    },
  });
});

export default auth;