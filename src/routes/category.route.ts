import { Router } from 'express';
import { CategoryController } from '../controllers/Category.controller.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import {
  createCategoryRequestBodySchema,
  CreateCategoryRequestBody
} from '../schema/zod/api/requests/category.schema.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';

export const router = Router();

const categoryController = new CategoryController();

// Middleware handle request body
const validateRequestBodyCreate = validateRequestBody<CreateCategoryRequestBody>(createCategoryRequestBodySchema);

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreate,
  categoryController.create.bind(categoryController)
);
