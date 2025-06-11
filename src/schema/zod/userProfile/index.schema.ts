import { z } from 'zod';
import { avatarUrlSchema, firstNameSchema, lastNameSchema, phoneSchema, userAuthIdSchema } from './fields.schema.js';

export const userProfileZodSchema = z.object({
  userAuthId: userAuthIdSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  avatarUrl: avatarUrlSchema.optional(),
  phone: phoneSchema
});

export type UserProfileSchemaType = z.infer<typeof userProfileZodSchema>;
