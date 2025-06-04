import { z } from 'zod';
import { emailSchema } from './fields.schema.js';

export const createUserAuthLocalValidation = z.object({
  email: emailSchema
});

export type CreateUserAuthLocalValidation = z.infer<typeof createUserAuthLocalValidation>;
