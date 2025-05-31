import { z } from 'zod';
import { ErrorMessage } from '../../constants/errorMessage.constant.js';
import { UserAuthRoleEnum } from '../../enums/userAuthRole.enum.js';
import { UserAuthProviderEnum } from '../../enums/userAuthProvider.enum.js';

type UserAuthSchemaType = z.infer<typeof userAuthZodSchema>;
type ValidationContext = z.RefinementCtx;
type ProviderForValidation = UserAuthProviderEnum.LOCAL | UserAuthProviderEnum.ZALO;

type ValidationBasedProvider = {
  [key in ProviderForValidation]: (data: UserAuthSchemaType, ctx: ValidationContext) => void;
};

const {
  MIN_LENGTH_PASSWORD,
  MAX_LENGTH_PASSWORD,
  WEAK_PASSWORD,
  PASSWORD_MISMATCH,
  PASSWORD_REQUIRED,
  PASSWORD_CONFIRM_REQUIRED,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  ZALO_ID_REQUIRED
} = ErrorMessage.userAuth;
const REGEX_CHECK_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const RoleSchema = z.nativeEnum(UserAuthRoleEnum);
const ProviderSchema = z.nativeEnum(UserAuthProviderEnum);

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
    email: z.string().email(INVALID_EMAIL).optional(),
    password: z
      .string()
      .min(8, MIN_LENGTH_PASSWORD)
      .max(16, MAX_LENGTH_PASSWORD)
      .regex(REGEX_CHECK_PASSWORD, WEAK_PASSWORD)
      .optional(),
    passwordConfirm: z.string().min(8, MIN_LENGTH_PASSWORD).max(16, MAX_LENGTH_PASSWORD).optional(),
    role: RoleSchema,
    provider: ProviderSchema,
    isVerify: z.boolean(),
    isFirstLogin: z.boolean(),
    zaloId: z.string().optional()
  })
  .superRefine((data, ctx) => {
    const validation = validationBasedProvider[data.provider];
    if (!validation) throw new Error(`Provider ${data.provider} is not support !`);
    validation(data, ctx);
  });
