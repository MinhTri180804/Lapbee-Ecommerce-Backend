import { Router } from 'express';
import { UserProfileController } from '../controllers/userProfile.controller';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import {
  CreateUserProfileRequestBody,
  createUserProfileRequestBodySchema
} from '../schema/zod/api/requests/userProfile.schema';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';

export const router = Router();

const validateRequestBodyCreate = validateRequestBody<CreateUserProfileRequestBody>(createUserProfileRequestBodySchema);

const userProfileController = new UserProfileController();

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreate,
  userProfileController.create.bind(userProfileController)
);
