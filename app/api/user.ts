import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { jwt } from "hono/jwt";
import { z } from 'zod';
import { getUserProfile } from "../lib/user/getUserProfile";
import { updateUserProfile } from "../lib/user/updateUserProfile";
import { zValidator } from './util/validator-wrapper';
import { AUTH_COOKIE_NAME } from "../env";
import { HTTPException } from "hono/http-exception";

const user = new Hono<{ Variables: JwtVariables }>();

user.use('*', async (c, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return c.json({ error: { message: 'JWT_SECRET is not configured' } }, 500);
  }
  return jwt({ secret, alg: "HS256", cookie: AUTH_COOKIE_NAME })(c, next);
});

const profileSchema = z.object({
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
  dateOfBirth: z.optional(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  street: z.optional(z.string()),
  city: z.optional(z.string()),
  postalCode: z.optional(z.string()),
  country: z.optional(z.string()),
});

user.post('/profile', zValidator('json', profileSchema), async (c) => {
  const { firstName, lastName, dateOfBirth, street, city, postalCode, country } = c.req.valid('json');
  const { sub } = c.get('jwtPayload');

  const user = await updateUserProfile(Number(sub), {
    firstName,
    lastName,
    dateOfBirth,
    street,
    city,
    postalCode,
    country,
  });

  return c.json({
    message: 'User profile updated successfully',
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      street: user.street,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
    },
  });
});

user.get('/profile', async (c) => {
  const { sub } = c.get('jwtPayload');

  const user = await getUserProfile(Number(sub));
  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return c.json({
    data: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      street: user.street,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
    },
  });
});

export default user;