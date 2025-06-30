import { z } from 'zod';
import { avatarSchema, firstNameSchema, lastNameSchema, phoneSchema, userAuthIdSchema } from './fields.schema.js';
import { objectIdSchema } from '../commons.schema.js';

export const userProfileZodSchema = z.object({
  _id: objectIdSchema,
  userAuthId: userAuthIdSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  avatar: avatarSchema.nullable(),
  phone: phoneSchema
});

export type UserProfileSchemaType = z.infer<typeof userProfileZodSchema>;
