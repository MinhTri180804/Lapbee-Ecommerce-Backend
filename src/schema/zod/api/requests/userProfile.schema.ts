import { z } from 'zod';
import { avatarSchema, firstNameSchema, lastNameSchema, phoneSchema } from '../../userProfile/fields.schema.js';

export const createUserProfileRequestBodySchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  avatar: avatarSchema.nullable().optional(),
  phone: phoneSchema
});

export const updateUserProfileRequestBodySchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.optional()
});

export type CreateUserProfileRequestBody = z.infer<typeof createUserProfileRequestBodySchema>;
export type UpdateUserProfileRequestBody = z.infer<typeof updateUserProfileRequestBodySchema>;
