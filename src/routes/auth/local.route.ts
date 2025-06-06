import { Router } from 'express';
import { AuthLocalController } from '../../controllers/auth/local.controller.js';
import { validateRequestBody } from '../../middleware/validateRequestBody.middleware.js';
import {
  RegisterLocalRequestBody,
  registerLocalRequestBodySchema,
  ResendVerifyEmailRequestBody,
  resendVerifyEmailRequestBodySchema,
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

router.post('/register', validateRequestBodyRegister, authLocalController.register.bind(authLocalController));
router.post('/verify-email', validateRequestBodyVerifyEmail, authLocalController.verifyEmail.bind(authLocalController));
router.post('/set-password', validateRequestBodySetPassword, authLocalController.setPassword.bind(authLocalController));
router.post(
  '/resend-verify-email',
  validateRequestBodyResendVerifyEmail,
  authLocalController.resendVerifyEmail.bind(authLocalController)
);
