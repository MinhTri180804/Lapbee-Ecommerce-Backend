import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';
import { UserAuthProviderEnum } from '../../../enums/userAuthProvider.enum.js';
import {
  emailSchema,
  isFirstLoginSchema,
  isVerifySchema,
  jtiSetPasswordSchema,
  passwordConfirmSchema,
  passwordSchema,
  providerSchema,
  roleSchema,
  zaloIdSchema
} from './fields.schema.js';

type ValidationContext = z.RefinementCtx;
type ProviderForValidation = UserAuthProviderEnum.LOCAL | UserAuthProviderEnum.ZALO;

type ValidationBasedProvider = {
  [key in ProviderForValidation]: (data: UserAuthSchemaType, ctx: ValidationContext) => void;
};

const { PASSWORD_MISMATCH, PASSWORD_REQUIRED, PASSWORD_CONFIRM_REQUIRED, EMAIL_REQUIRED, ZALO_ID_REQUIRED } =
  ValidationMessages.userAuth;

const validationBasedProvider: ValidationBasedProvider = {
  [UserAuthProviderEnum.LOCAL]: (data, ctx) => validationLocal(data, ctx),
  [UserAuthProviderEnum.ZALO]: (data, ctx) => validationZalo(data, ctx)
};

const validationLocal = (data: UserAuthSchemaType, ctx: ValidationContext) => {
  const { email, password, passwordConfirm } = data;
  if (!email) {
    ctx.addIssue({
      path: ['email'],
      code: z.ZodIssueCode.custom,
      message: EMAIL_REQUIRED
    });
  }

  if (!password) {
    ctx.addIssue({
      path: ['password'],
      code: z.ZodIssueCode.custom,
      message: PASSWORD_REQUIRED
    });
  }

  if (!passwordConfirm) {
    ctx.addIssue({
      path: ['passwordConfirm'],
      code: z.ZodIssueCode.custom,
      message: PASSWORD_CONFIRM_REQUIRED
    });
  }

  if (password !== passwordConfirm) {
    ctx.addIssue({
      path: ['passwordConfirm'],
      code: z.ZodIssueCode.custom,
      message: PASSWORD_MISMATCH
    });
  }
};

const validationZalo = (data: UserAuthSchemaType, ctx: ValidationContext) => {
  const { zaloId } = data;
  if (!zaloId) {
    ctx.addIssue({
      path: ['zaloId'],
      code: z.ZodIssueCode.custom,
      message: ZALO_ID_REQUIRED
    });
  }
};

export const userAuthZodSchema = z
  .object({
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    passwordConfirm: passwordConfirmSchema.optional(),
    role: roleSchema,
    provider: providerSchema,
    isVerify: isVerifySchema,
    isFirstLogin: isFirstLoginSchema,
    zaloId: zaloIdSchema.optional(),
    jtiSetPassword: jtiSetPasswordSchema.optional().nullable()
  })
  .superRefine((data, ctx) => {
    if (data.provider !== UserAuthProviderEnum.BOTH) {
      const validation = validationBasedProvider[data.provider];
      validation(data, ctx);
      return;
    }

    throw new Error(`Provider ${data.provider} is not support !`);
  });

export type UserAuthSchemaType = z.infer<typeof userAuthZodSchema>;
