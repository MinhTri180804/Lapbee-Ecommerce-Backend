import { z } from 'zod';
import { nameSchema, orderSchema, parentIdSchema, slugSchema } from '../../category/field.schema.js';
import { ValidationMessages } from 'src/constants/validationMessages.constant.js';

const { PARENT_ID_REQUIRED } = ValidationMessages.api.request.category.changeParentId;
const { NEW_ORDER_REQUIRED } = ValidationMessages.api.request.category.changeOrder;

export const createCategoryRequestBodySchema = z.object({
  name: nameSchema,
  parentId: parentIdSchema.nullable(),
  slug: slugSchema,
  order: orderSchema
});

export const updateCategoryRequestBodySchema = z.object({
  name: nameSchema.optional(),
  parentId: parentIdSchema.optional(),
  slug: slugSchema.optional(),
  order: orderSchema.optional()
});

export const changeParentIdRequestBodySchema = z.object({
  newParentId: z.string({ required_error: PARENT_ID_REQUIRED }).nullable()
});

export const changeOrderCategoryRequestBodySchema = z.object({
  newOrder: z.number({ required_error: NEW_ORDER_REQUIRED })
});

export type CreateCategoryRequestBody = z.infer<typeof createCategoryRequestBodySchema>;
export type UpdateCategoryRequestBody = z.infer<typeof updateCategoryRequestBodySchema>;
export type ChangeParentIdRequestBody = z.infer<typeof changeParentIdRequestBodySchema>;
export type ChangeOrderCategoryRequestBody = z.infer<typeof changeOrderCategoryRequestBodySchema>;
