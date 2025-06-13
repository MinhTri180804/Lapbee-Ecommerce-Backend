import { Router } from 'express';
import { UserProfileController } from '../controllers/userProfile.controller.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import {
  CreateUserProfileRequestBody,
  createUserProfileRequestBodySchema,
  UpdateUserProfileRequestBody,
  updateUserProfileRequestBodySchema
} from '../schema/zod/api/requests/userProfile.schema.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';
import { UploadMulterMiddleware } from '../middleware/UploadMulter.middleware.js';

export const router = Router();

const userProfileController = new UserProfileController();

// Validate middleware
const validateRequestBodyCreate = validateRequestBody<CreateUserProfileRequestBody>(createUserProfileRequestBodySchema);
const validateRequestBodyUpdate = validateRequestBody<UpdateUserProfileRequestBody>(updateUserProfileRequestBodySchema);

// Upload multer middleware
const uploadMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'avatar' });

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreate,
  userProfileController.create.bind(userProfileController)
);

router.get('/', verifyAccessTokenMiddleware, userProfileController.getMe.bind(userProfileController));
router.patch(
  '/avatar',
  verifyAccessTokenMiddleware,
  uploadMulterMiddleware.singleUpload.bind(uploadMulterMiddleware),
  userProfileController.updateAvatar.bind(userProfileController)
);
router.delete('/avatar', verifyAccessTokenMiddleware, userProfileController.deleteAvatar.bind(userProfileController));
router.patch(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyUpdate,
  userProfileController.update.bind(userProfileController)
);
