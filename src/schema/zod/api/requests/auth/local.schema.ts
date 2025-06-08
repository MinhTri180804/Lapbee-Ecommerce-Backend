import { z } from 'zod';
import { ValidationMessages } from '../../../../../constants/validationMessages.constant.js';
import { emailSchema, passwordSchema } from '../../../userAuth/fields.schema.js';

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

const { EMAIL_INVALID: EMAIL_INVALID_RESEND, EMAIL_REQUIRED: EMAIL_REQUIRED_RESEND } =
  ValidationMessages.api.request.auth.local.resendVerifyEmail;

const {
  EMAIL_INVALID: EMAIL_INVALID_RESEND_SET_PASSWORD_TOKEN,
  EMAIL_REQUIRED: EMAIL_REQUIRED_RESEND_SET_PASSWORD_TOKEN
} = ValidationMessages.api.request.auth.local.resendSetPasswordToken;

const { EMAIL_INVALID: EMAIL_INVALID_FORGOT_PASSWORD, EMAIL_REQUIRED: EMAIL_REQUIRED_FORGOT_PASSWORD } =
  ValidationMessages.api.request.auth.local.forgotPassword;

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

export const resendVerifyEmailRequestBodySchema = z.object({
  email: z.string({ required_error: EMAIL_REQUIRED_RESEND }).email(EMAIL_INVALID_RESEND)
});

export const resendSetPasswordTokenRequestBodySchema = z.object({
  email: z
    .string({ required_error: EMAIL_REQUIRED_RESEND_SET_PASSWORD_TOKEN })
    .email(EMAIL_INVALID_RESEND_SET_PASSWORD_TOKEN)
});

export const loginRequestBodySchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const forgotPasswordRequestBodySchema = z.object({
  email: z.string({ required_error: EMAIL_REQUIRED_FORGOT_PASSWORD }).email(EMAIL_INVALID_FORGOT_PASSWORD)
});

export type RegisterLocalRequestBody = z.infer<typeof registerLocalRequestBodySchema>;
export type VerifyEmailRegisterRequestBody = z.infer<typeof verifyEmailRegisterRequestBodySchema>;
export type SetPasswordRequestBody = z.infer<typeof setPasswordRequestBodySchema>;
export type ResendVerifyEmailRequestBody = z.infer<typeof resendVerifyEmailRequestBodySchema>;
export type ResendSetPasswordTokenRequestBody = z.infer<typeof resendSetPasswordTokenRequestBodySchema>;
export type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;
export type ForgotPasswordRequestBody = z.infer<typeof forgotPasswordRequestBodySchema>;
