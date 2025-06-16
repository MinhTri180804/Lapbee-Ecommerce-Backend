import { Router } from 'express';
import { CategoryController } from '../controllers/Category.controller.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import {
  createCategoryRequestBodySchema,
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody,
  updateCategoryRequestBodySchema,
  ChangeParentIdRequestBody,
  changeParentIdRequestBodySchema
} from '../schema/zod/api/requests/category.schema.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';

export const router = Router();

const categoryController = new CategoryController();

// Middleware handle request body
const validateRequestBodyCreate = validateRequestBody<CreateCategoryRequestBody>(createCategoryRequestBodySchema);
const validateRequestBodyUpdate = validateRequestBody<UpdateCategoryRequestBody>(updateCategoryRequestBodySchema);
const validateRequestBodyChangeParentId = validateRequestBody<ChangeParentIdRequestBody>(
  changeParentIdRequestBodySchema
);

router.post(
  '/',
  verifyAccessTokenMiddleware,
  validateRequestBodyCreate,
  categoryController.create.bind(categoryController)
);

router.delete('/:id', verifyAccessTokenMiddleware, categoryController.delete.bind(categoryController));
router.patch(
  '/:id',
  verifyAccessTokenMiddleware,
  validateRequestBodyUpdate,
  categoryController.update.bind(categoryController)
);

router.get('/:id', categoryController.getDetails.bind(categoryController));
router.get('/', categoryController.getAll.bind(categoryController));
router.patch(
  '/:id/change-parent',
  verifyAccessTokenMiddleware,
  validateRequestBodyChangeParentId,
  categoryController.changeParentId.bind(categoryController)
);
