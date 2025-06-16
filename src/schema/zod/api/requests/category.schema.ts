import { z } from 'zod';
import { nameSchema, parentIdSchema, slugSchema } from '../../category/field.schema.js';

export const createCategoryRequestBodySchema = z.object({
  name: nameSchema,
  parentId: parentIdSchema.nullable(),
  slug: slugSchema
});

export type CreateCategoryRequestBody = z.infer<typeof createCategoryRequestBodySchema>;
