import { z } from 'zod';
import { ValidationMessages } from '../../../../../constants/validationMessages.constant.js';
import { passwordSchema } from '../../../userAuth/fields.schema.js';

const { EMAIL_REQUIRED: EMAIL_REQUIRED_REGISTER, EMAIL_INVALID: EMAIL_INVALID_REGISTER } =
  ValidationMessages.api.request.auth.local.register;

const {
  EMAIL_INVALID: EMAIL_INVALID_VERIFY,
  EMAIL_REQUIRED: EMAIL_REQUIRED_VERIFY,
  OTP_REQUIRED: OTP_REQUIRED_VERIFY,
  OTP_INVALID: OTP_INVALID_VERIFY
} = ValidationMessages.api.request.auth.local.verifyEmailRegister;

const {
  TOKEN_SET_PASSWORD_REQUIRED: TOKEN_SET_PASSWORD_REQUIRED_SET_PASSWORD,
  PASSWORD_CONFIRM_REQUIRED: PASSWORD_CONFIRM_REQUIRED_SET_PASSWORD,
  PASSWORD_CONFIRM_MISMATCH: PASSWORD_CONFIRM_MISMATCH_SET_PASSWORD
} = ValidationMessages.api.request.auth.local.setPassword;

export const registerLocalRequestBodySchema = z.object({
  email: z
    .string({
      required_error: EMAIL_REQUIRED_REGISTER
    })
    .email(EMAIL_INVALID_REGISTER)
});

export const verifyEmailRegisterRequestBodySchema = z.object({
  email: z
    .string({
      required_error: EMAIL_REQUIRED_VERIFY
    })
    .email(EMAIL_INVALID_VERIFY),

  otp: z.string({
    required_error: OTP_REQUIRED_VERIFY,
    invalid_type_error: OTP_INVALID_VERIFY
  })
});

export const setPasswordRequestBodySchema = z
  .object({
    tokenSetPassword: z.string({ required_error: TOKEN_SET_PASSWORD_REQUIRED_SET_PASSWORD }),
    password: passwordSchema,
    passwordConfirm: z.string({ required_error: PASSWORD_CONFIRM_REQUIRED_SET_PASSWORD })
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        path: ['passwordConfirm'],
        code: z.ZodIssueCode.custom,
        message: PASSWORD_CONFIRM_MISMATCH_SET_PASSWORD
      });
    }
  });

export type RegisterLocalRequestBody = z.infer<typeof registerLocalRequestBodySchema>;
export type VerifyEmailRegisterRequestBody = z.infer<typeof verifyEmailRegisterRequestBodySchema>;
export type SetPasswordRequestBody = z.infer<typeof setPasswordRequestBodySchema>;
