import { Router } from 'express';
import { BrandController } from '../controllers/Brand.controller.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';
import {
  CreateBrandRequestBody,
  createBrandRequestBodySchema,
  UpdateBrandRequestBody,
  updateBrandRequestBodySchema
} from '../schema/zod/api/requests/brand.schema.js';

export const router = Router();

const brandController = new BrandController();

// Middleware validate request body
const validateCreateBrandRequestBody = validateRequestBody<CreateBrandRequestBody>(createBrandRequestBodySchema);
const validateUpdateBrandRequestBody = validateRequestBody<UpdateBrandRequestBody>(updateBrandRequestBodySchema);

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

router.get('/', brandController.getAll.bind(brandController));
