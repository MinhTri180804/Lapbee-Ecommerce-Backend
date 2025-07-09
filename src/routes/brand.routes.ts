import { Router } from 'express';
import { BrandController } from '../controllers/Brand.controller.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';
import {
  createDTO as brandCreateRequestDTO,
  CreateDTO as BrandCreateRequestDTO
} from '../dto/request/brand/create.dto.js';
import {
  updateDTO as brandUpdateRequestDTO,
  UpdateDTO as BrandUpdateRequestDTO
} from '../dto/request/brand/update.dto.js';

export const router = Router();

const brandController = new BrandController();

// Middleware validate request body
const validateCreateBrandRequestBody = validateRequestBody<BrandCreateRequestDTO>(brandCreateRequestDTO);
const validateUpdateBrandRequestBody = validateRequestBody<BrandUpdateRequestDTO>(brandUpdateRequestDTO);

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
router.get('/:id', brandController.getDetails.bind(brandController));
router.get('/slug/:slug', brandController.getDetailsBySlug.bind(brandController));
