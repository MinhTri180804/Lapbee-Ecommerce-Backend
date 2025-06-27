import { Router } from 'express';
import { UploadMulterMiddleware } from '../../../../middleware/UploadMulter.middleware.js';
import { validateRequestBody } from '../../../../middleware/validateRequestBody.middleware.js';
import { uploadLogoDTO, UploadLogoDTO } from '../../../../dto/request/external/cloudinary/brand/uploadLogo.dto.js';
import { BrandCloudinaryController } from '../../../../controllers/external/cloudinary/BrandCloudinary.controller.js';

export const router = Router();

const brandCloudinaryController = new BrandCloudinaryController();

// Middleware requestBody
const uploadLogoMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'logo' });

// Middleware validate file upload multer
const validateRequestBodyUploadLogo = validateRequestBody<UploadLogoDTO>(uploadLogoDTO);

router.post(
  '/logo/upload/single',
  uploadLogoMulterMiddleware.singleUpload.bind(uploadLogoMulterMiddleware),
  validateRequestBodyUploadLogo,
  brandCloudinaryController.uploadLogo.bind(brandCloudinaryController)
);
