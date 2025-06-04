import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';
import { UserAuthProviderEnum } from '../../../enums/userAuthProvider.enum.js';
import { UserAuthRoleEnum } from '../../../enums/userAuthRole.enum.js';

const {
  MIN_LENGTH_PASSWORD,
  MAX_LENGTH_PASSWORD,
  WEAK_PASSWORD,
  WEAK_PASSWORD_CONFIRM,
  PASSWORD_REQUIRED,
  PASSWORD_CONFIRM_REQUIRED,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  ZALO_ID_REQUIRED,
  MAX_LENGTH_PASSWORD_CONFIRM,
  MIN_LENGTH_PASSWORD_CONFIRM
} = ValidationMessages.userAuth;

const REGEX_CHECK_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const emailSchema = z.string({ required_error: EMAIL_REQUIRED }).email(INVALID_EMAIL);
export const passwordSchema = z
  .string({ required_error: PASSWORD_REQUIRED })
  .min(8, MIN_LENGTH_PASSWORD)
  .max(16, MAX_LENGTH_PASSWORD)
  .regex(REGEX_CHECK_PASSWORD, WEAK_PASSWORD);

export const passwordConfirmSchema = z
  .string({ required_error: PASSWORD_CONFIRM_REQUIRED })
  .min(8, MIN_LENGTH_PASSWORD_CONFIRM)
  .max(16, MAX_LENGTH_PASSWORD_CONFIRM)
  .regex(REGEX_CHECK_PASSWORD, WEAK_PASSWORD_CONFIRM);

export const roleSchema = z.nativeEnum(UserAuthRoleEnum);
export const providerSchema = z.nativeEnum(UserAuthProviderEnum);
export const isFirstLoginSchema = z.boolean();
export const isVerifySchema = z.boolean();
export const zaloIdSchema = z.string({ required_error: ZALO_ID_REQUIRED });
export const jtiSetPasswordSchema = z.string();
