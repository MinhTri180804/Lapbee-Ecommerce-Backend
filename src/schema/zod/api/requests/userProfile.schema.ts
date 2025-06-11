import { z } from 'zod';
import { avatarUrlSchema, firstNameSchema, lastNameSchema, phoneSchema } from '../../userProfile/fields.schema.js';

export const createUserProfileRequestBodySchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  avatarUrl: avatarUrlSchema.nullable(),
  phone: phoneSchema
});

export type CreateUserProfileRequestBody = z.infer<typeof createUserProfileRequestBodySchema>;
