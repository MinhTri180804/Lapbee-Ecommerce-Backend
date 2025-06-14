import { Router } from 'express';
import { BrandController } from '../controllers/Brand.controller.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import {
  createBrandRequestBodySchema,
  CreateBrandRequestBodySchema,
  updateBrandRequestBodySchema,
  UpdateBrandRequestBodySchema
} from '../schema/zod/api/requests/brand.schema.js';

export const router = Router();

const brandController = new BrandController();

// Middleware validate request body
const validateCreateBrandRequestBody = validateRequestBody<CreateBrandRequestBodySchema>(createBrandRequestBodySchema);
const validateUpdateBrandRequestBody = validateRequestBody<UpdateBrandRequestBodySchema>(updateBrandRequestBodySchema);

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateCreateBrandRequestBody,
  brandController.create.bind(brandController)
);

router.delete('/:id', verifyAccessTokenMiddleware, brandController.delete.bind(brandController));

router.patch(
  '/:id',
  verifyAccessTokenMiddleware,
  validateUpdateBrandRequestBody,
  brandController.update.bind(brandController)
);
