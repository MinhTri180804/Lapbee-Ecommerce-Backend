import { z } from 'zod';
import { ValidationMessages } from '../../../../../constants/validationMessages.constant.js';

const { EMAIL_REQUIRED: EMAIL_REQUIRED_REGISTER, EMAIL_INVALID: EMAIL_INVALID_REGISTER } =
  ValidationMessages.api.request.auth.local.register;

const {
  EMAIL_INVALID: EMAIL_INVALID_VERIFY,
  EMAIL_REQUIRED: EMAIL_REQUIRED_VERIFY,
  OTP_REQUIRED: OTP_REQUIRED_VERIFY,
  OTP_INVALID: OTP_INVALID_VERIFY
} = ValidationMessages.api.request.auth.local.verifyEmailRegister;

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

export type RegisterLocalRequestBody = z.infer<typeof registerLocalRequestBodySchema>;
export type VerifyEmailRegisterRequestBody = z.infer<typeof verifyEmailRegisterRequestBodySchema>;
