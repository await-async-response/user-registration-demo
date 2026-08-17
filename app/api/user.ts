import { Hono } from "hono";
import { z } from 'zod';
import { zValidator } from './util/validator-wrapper';

const user = new Hono();

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
  console.log('User profile updated:', { firstName, lastName, dateOfBirth, street, city, postalCode, country });

  return c.json({
    message: 'User profile updated successfully',
    data: {
      firstName,
      lastName,
      dateOfBirth,
      street,
      city,
      postalCode,
      country,
    },
  });
});

export default user;