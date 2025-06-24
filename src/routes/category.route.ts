import { Router } from 'express';
import { CategoryController } from '../controllers/Category.controller.js';
import { validateRequestBody } from '../middleware/validateRequestBody.middleware.js';
import { verifyAccessTokenMiddleware } from '../middleware/verifyAccessToken.middleware.js';
import {
  CreateDTO as CategoryCreateRequestDTO,
  createDTO as categoryCreateRequestDTO
} from '../dto/request/category/create.dto.js';
import {
  updateDTO as categoryUpdateRequestDTO,
  UpdateDTO as CategoryUpdateRequestDTO
} from '../dto/request/category/update.dto.js';
import {
  changeOrderDTO as categoryChangeOrderRequestDTO,
  ChangeOrderDTO as CategoryChangeOrderRequestDTO
} from '../dto/request/category/changeOrder.dto.js';
import {
  changeParentIdDTO as categoryChangeParentIdRequestDTO,
  ChangeParentIdDTO as CategoryChangeParentIdRequestDTO
} from '../dto/request/category/changeParentId.dto.js';

export const router = Router();

const categoryController = new CategoryController();

// Middleware handle request body
const validateRequestBodyCreate = validateRequestBody<CategoryCreateRequestDTO>(categoryCreateRequestDTO);
const validateRequestBodyUpdate = validateRequestBody<CategoryUpdateRequestDTO>(categoryUpdateRequestDTO);
const validateRequestBodyChangeParentId = validateRequestBody<CategoryChangeParentIdRequestDTO>(
  categoryChangeParentIdRequestDTO
);
const validateRequestBodyChangeOrder =
  validateRequestBody<CategoryChangeOrderRequestDTO>(categoryChangeOrderRequestDTO);

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

router.get('/tree', categoryController.getAllTree.bind(categoryController));
router.get('/:id', categoryController.getDetails.bind(categoryController));
router.get('/', categoryController.getAll.bind(categoryController));
router.patch(
  '/:id/change-parent',
  verifyAccessTokenMiddleware,
  validateRequestBodyChangeParentId,
  categoryController.changeParentId.bind(categoryController)
);
router.patch(
  '/:id/change-order',
  verifyAccessTokenMiddleware,
  validateRequestBodyChangeOrder,
  categoryController.changeOrder.bind(categoryController)
);
