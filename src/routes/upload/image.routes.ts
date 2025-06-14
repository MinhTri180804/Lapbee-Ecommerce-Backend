import { Router } from 'express';
import { UploadImageController } from '../../controllers/upload/image.controller.js';
import { UploadMulterMiddleware } from '../../middleware/UploadMulter.middleware.js';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken.middleware.js';

export const router = Router();

const uploadImageController = new UploadImageController();

// Middleware for multer upload
const uploadImageLogoBrandMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'logo' });

router.post(
  '/brand/logo',
  verifyAccessTokenMiddleware,
  uploadImageLogoBrandMulterMiddleware.singleUpload.bind(uploadImageLogoBrandMulterMiddleware),
  uploadImageController.uploadLogoBrand.bind(uploadImageController)
);

router.delete('/brand/logo/:public_id', uploadImageController.deleteLogoBrand.bind(uploadImageController));
