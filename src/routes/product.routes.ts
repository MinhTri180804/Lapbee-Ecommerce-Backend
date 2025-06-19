import { Router } from 'express';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import { CreateProductRequestBody, createProductRequestBodySchema } from '../schema/zod/api/requests/product.schema.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';
import { ProductController } from '../controllers/Product.controller.js';

export const router = Router();
const productController = new ProductController();

// Middleware validate request body
const validateRequestBodyCreateProduct = validateRequestBody<CreateProductRequestBody>(createProductRequestBodySchema);

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreateProduct,
  productController.create.bind(productController)
);
