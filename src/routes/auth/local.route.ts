import { Router } from 'express';
import { AuthLocalController } from '../../controllers/auth/local.controller.js';
import { validateRequestBody } from '../../middleware/validateRequestBody.middleware.js';
import {
  RegisterLocalRequestBody,
  registerLocalRequestBodySchema
} from '../../schema/zod/api/requests/auth/local.schema.js';

export const router = Router();

const authLocalController = new AuthLocalController();
const validateRequestBodyRegister = validateRequestBody<RegisterLocalRequestBody>(registerLocalRequestBodySchema);

router.post('/register', validateRequestBodyRegister, authLocalController.register);
