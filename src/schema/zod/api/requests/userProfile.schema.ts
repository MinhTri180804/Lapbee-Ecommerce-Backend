import { z } from 'zod';
import { avatarSchema, firstNameSchema, lastNameSchema, phoneSchema } from '../../userProfile/fields.schema.js';

export const createUserProfileRequestBodySchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  avatar: avatarSchema.nullable().optional(),
  phone: phoneSchema
});

export type CreateUserProfileRequestBody = z.infer<typeof createUserProfileRequestBodySchema>;
