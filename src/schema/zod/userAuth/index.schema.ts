import { z } from 'zod';
import {
  blockedStatusSchema,
  emailSchema,
  isFirstLoginSchema,
  isVerifySchema,
  jtiSetPasswordSchema,
  passwordConfirmSchema,
  passwordSchema,
  providerSchema,
  roleSchema,
  userProfileIdSchema,
  zaloIdSchema
} from './fields.schema.js';

export const userAuthZodSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  passwordConfirm: passwordConfirmSchema.optional(),
  userProfileId: userProfileIdSchema.optional().nullable(),
  role: roleSchema,
  provider: providerSchema,
  isVerify: isVerifySchema,
  isFirstLogin: isFirstLoginSchema,
  zaloId: zaloIdSchema.optional(),
  jtiSetPassword: jtiSetPasswordSchema.optional().nullable(),
  blockedStatus: blockedStatusSchema
    .default({
      isBlocked: false,
      message: null
    })
    .optional()
});

export type UserAuthSchemaType = z.infer<typeof userAuthZodSchema>;
