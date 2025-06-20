import { Router } from 'express';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import { CreateProductRequestBody, createProductRequestBodySchema } from '../schema/zod/api/requests/product.schema.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';
import { ProductController } from '../controllers/Product.controller.js';
import { ProductVariantController } from '../controllers/ProductVariant.controller.js';
import {
  CreateProductVariantRequestBody,
  createProductVariantRequestBodySchema
} from '../schema/zod/api/requests/productVariant.schema.js';

export const router = Router();
const productController = new ProductController();
const productVariantController = new ProductVariantController();

// Middleware validate request body
const validateRequestBodyCreateProduct = validateRequestBody<CreateProductRequestBody>(createProductRequestBodySchema);
const validateRequestBodyCreateProductVariant = validateRequestBody<CreateProductVariantRequestBody>(
  createProductVariantRequestBodySchema
);

router.post(
  '/:id/product-variant',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreateProductVariant,
  productVariantController.create.bind(productVariantController)
);

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreateProduct,
  productController.create.bind(productController)
);
