import { Router } from 'express';
import { validateRequestBody } from '../../../../middleware/validateRequestBody.middleware.js';
import { UploadMulterMiddleware } from '../../../../middleware/UploadMulter.middleware.js';
import {
  uploadProductImageDTO,
  UploadProductImageDTO
} from '../../../../dto/request/external/cloudinary/product/uploadProductImage.dto.js';
import { ProductCloudinaryController } from '../../../../controllers/external/cloudinary/ProductCloudinary.controller.js';

export const router = Router();

const productCloudinaryController = new ProductCloudinaryController();

// Validate request body middleware
const validateRequestBodyUploadProductImage = validateRequestBody<UploadProductImageDTO>(uploadProductImageDTO);

// Validate upload multer middleware
const uploadProductImageMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'productImage' });

router.post(
  '/upload/single',
  uploadProductImageMulterMiddleware.singleUpload.bind(uploadProductImageMulterMiddleware),
  validateRequestBodyUploadProductImage,
  productCloudinaryController.uploadProductImage.bind(productCloudinaryController)
);

// router.post('/product/upload/multiple');

router.delete('/:publicId', productCloudinaryController.deleteProductImage.bind(productCloudinaryController));
