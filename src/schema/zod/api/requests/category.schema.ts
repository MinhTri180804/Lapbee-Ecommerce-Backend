import { z } from 'zod';
import { nameSchema, parentIdSchema, slugSchema } from '../../category/field.schema.js';

export const createCategoryRequestBodySchema = z.object({
  name: nameSchema,
  parentId: parentIdSchema.nullable(),
  slug: slugSchema
});

export const updateCategoryRequestBodySchema = z.object({
  name: nameSchema.optional(),
  parentId: parentIdSchema.optional(),
  slug: slugSchema.optional()
});

export type CreateCategoryRequestBody = z.infer<typeof createCategoryRequestBodySchema>;
export type UpdateCategoryRequestBody = z.infer<typeof updateCategoryRequestBodySchema>;
