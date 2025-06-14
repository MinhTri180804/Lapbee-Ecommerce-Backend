import { Router } from 'express';
import { UploadImageController } from '../../controllers/upload/image.controller.js';
import { UploadMulterMiddleware } from '../../middleware/UploadMulter.middleware.js';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken.middleware.js';

export const router = Router();

const uploadImageController = new UploadImageController();

// Middleware for multer upload
const uploadImageLogoBrandMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'logo' });
const uploadImageBannerBrandMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'banner' });

router.post(
  '/brand/logo',
  verifyAccessTokenMiddleware,
  uploadImageLogoBrandMulterMiddleware.singleUpload.bind(uploadImageLogoBrandMulterMiddleware),
  uploadImageController.uploadLogoBrand.bind(uploadImageController)
);

router.delete(
  '/brand/logo/:public_id',
  verifyAccessTokenMiddleware,
  uploadImageController.deleteLogoBrand.bind(uploadImageController)
);

router.post(
  '/brand/banner',
  verifyAccessTokenMiddleware,
  uploadImageBannerBrandMulterMiddleware.singleUpload.bind(uploadImageBannerBrandMulterMiddleware),
  uploadImageController.uploadBannerBrand.bind(uploadImageController)
);

router.delete(
  '/brand/banner/:public_id',
  verifyAccessTokenMiddleware,
  uploadImageController.deleteBannerBrand.bind(uploadImageController)
);
