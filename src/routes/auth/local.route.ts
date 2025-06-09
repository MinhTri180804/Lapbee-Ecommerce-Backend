import { Router } from 'express';
import { AuthLocalController } from '../../controllers/auth/local.controller.js';
import { validateRequestBody } from '../../middleware/validateRequestBody.middleware.js';
import {
  ForgotPasswordRequestBody,
  forgotPasswordRequestBodySchema,
  LoginRequestBody,
  loginRequestBodySchema,
  RefreshTokenRequestBody,
  refreshTokenRequestBodySchema,
  RegisterLocalRequestBody,
  registerLocalRequestBodySchema,
  ResendResetPasswordTokenRequestBody,
  resendResetPasswordTokenRequestBodySchema,
  ResendSetPasswordTokenRequestBody,
  resendSetPasswordTokenRequestBodySchema,
  ResendVerifyEmailRequestBody,
  resendVerifyEmailRequestBodySchema,
  ResetPasswordRequestBody,
  resetPasswordRequestBodySchema,
  SetPasswordRequestBody,
  setPasswordRequestBodySchema,
  VerifyEmailRegisterRequestBody,
  verifyEmailRegisterRequestBodySchema
} from '../../schema/zod/api/requests/auth/local.schema.js';

export const router = Router();

const authLocalController = new AuthLocalController();
const validateRequestBodyRegister = validateRequestBody<RegisterLocalRequestBody>(registerLocalRequestBodySchema);
const validateRequestBodyVerifyEmail = validateRequestBody<VerifyEmailRegisterRequestBody>(
  verifyEmailRegisterRequestBodySchema
);
const validateRequestBodySetPassword = validateRequestBody<SetPasswordRequestBody>(setPasswordRequestBodySchema);
const validateRequestBodyResendVerifyEmail = validateRequestBody<ResendVerifyEmailRequestBody>(
  resendVerifyEmailRequestBodySchema
);
const validateRequestBodyResendSetPasswordToken = validateRequestBody<ResendSetPasswordTokenRequestBody>(
  resendSetPasswordTokenRequestBodySchema
);
const validateRequestBodyLogin = validateRequestBody<LoginRequestBody>(loginRequestBodySchema);
const validateRequestBodyForgotPassword = validateRequestBody<ForgotPasswordRequestBody>(
  forgotPasswordRequestBodySchema
);
const validateRequestBodyResetPassword = validateRequestBody<ResetPasswordRequestBody>(resetPasswordRequestBodySchema);
const validateRequestBodyResendResetPasswordToken = validateRequestBody<ResendResetPasswordTokenRequestBody>(
  resendResetPasswordTokenRequestBodySchema
);
const validateRequestBodyRefreshToken = validateRequestBody<RefreshTokenRequestBody>(refreshTokenRequestBodySchema);

router.post('/register', validateRequestBodyRegister, authLocalController.register.bind(authLocalController));
router.post('/verify-email', validateRequestBodyVerifyEmail, authLocalController.verifyEmail.bind(authLocalController));
router.post('/set-password', validateRequestBodySetPassword, authLocalController.setPassword.bind(authLocalController));
router.post(
  '/resend-verify-email',
  validateRequestBodyResendVerifyEmail,
  authLocalController.resendVerifyEmail.bind(authLocalController)
);
router.post(
  '/resend-set-password-token',
  validateRequestBodyResendSetPasswordToken,
  authLocalController.resendSetPasswordToken.bind(authLocalController)
);
router.post('/login', validateRequestBodyLogin, authLocalController.login.bind(authLocalController));
router.post(
  '/forgot-password',
  validateRequestBodyForgotPassword,
  authLocalController.forgotPassword.bind(authLocalController)
);

router.post(
  '/reset-password',
  validateRequestBodyResetPassword,
  authLocalController.resetPassword.bind(authLocalController)
);
router.post(
  '/resend-reset-password-token',
  validateRequestBodyResendResetPasswordToken,
  authLocalController.resendResetPasswordToken.bind(authLocalController)
);
router.post(
  '/refresh-token',
  validateRequestBodyRefreshToken,
  authLocalController.refreshToken.bind(authLocalController)
);
