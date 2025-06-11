import { Router } from 'express';
import { UserProfileController } from '../controllers/userProfile.controller.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import {
  CreateUserProfileRequestBody,
  createUserProfileRequestBodySchema
} from '../schema/zod/api/requests/userProfile.schema.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';

export const router = Router();

const userProfileController = new UserProfileController();

const validateRequestBodyCreate = validateRequestBody<CreateUserProfileRequestBody>(createUserProfileRequestBodySchema);

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreate,
  userProfileController.create.bind(userProfileController)
);

router.get('/', verifyAccessTokenMiddleware, userProfileController.getMe.bind(userProfileController));
