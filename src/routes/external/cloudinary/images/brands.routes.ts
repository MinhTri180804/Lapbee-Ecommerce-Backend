import { Router } from 'express';
import { UploadMulterMiddleware } from '../../../../middleware/UploadMulter.middleware.js';
import { validateRequestBody } from '../../../../middleware/validateRequestBody.middleware.js';
import { uploadLogoDTO, UploadLogoDTO } from '../../../../dto/request/external/cloudinary/brand/uploadLogo.dto.js';
import { BrandCloudinaryController } from '../../../../controllers/external/cloudinary/BrandCloudinary.controller.js';
import {
  uploadBannerDTO,
  UploadBannerDTO
} from '../../../../dto/request/external/cloudinary/brand/uploadBanner.dto.js';

export const router = Router();

const brandCloudinaryController = new BrandCloudinaryController();

// Middleware requestBody
const uploadLogoMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'logo' });
const uploadBannerMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'banner' });

// Middleware validate file upload multer
const validateRequestBodyUploadLogo = validateRequestBody<UploadLogoDTO>(uploadLogoDTO);
const validateRequestBodyUploadBanner = validateRequestBody<UploadBannerDTO>(uploadBannerDTO);

router.post(
  '/logo/upload/single',
  uploadLogoMulterMiddleware.singleUpload.bind(uploadLogoMulterMiddleware),
  validateRequestBodyUploadLogo,
  brandCloudinaryController.uploadLogo.bind(brandCloudinaryController)
);

router.post(
  '/banner/upload/single',
  uploadBannerMulterMiddleware.singleUpload.bind(uploadBannerMulterMiddleware),
  validateRequestBodyUploadBanner,
  brandCloudinaryController.uploadBanner.bind(brandCloudinaryController)
);
