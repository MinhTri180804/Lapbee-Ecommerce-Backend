import { z } from 'zod';
import { avatarSchema, firstNameSchema, lastNameSchema, phoneSchema, userAuthIdSchema } from './fields.schema.js';

export const userProfileZodSchema = z.object({
  userAuthId: userAuthIdSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  avatar: avatarSchema.nullable(),
  phone: phoneSchema
});

export type UserProfileSchemaType = z.infer<typeof userProfileZodSchema>;
