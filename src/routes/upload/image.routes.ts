import { Router } from 'express';
import { UploadImageController } from '../../controllers/upload/image.controller.js';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken.middleware.js';
import { UploadMulterMiddleware } from '../../middleware/UploadMulter.middleware.js';

export const router = Router();

const uploadImageController = new UploadImageController();
const uploadImageLogoBrandMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'logo' });

router.post(
  '/brand/logo',
  verifyAccessTokenMiddleware,
  uploadImageLogoBrandMulterMiddleware.singleUpload.bind(uploadImageLogoBrandMulterMiddleware),
  uploadImageController.logoBrand.bind(uploadImageController)
);
