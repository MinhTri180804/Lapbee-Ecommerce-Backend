import { z } from 'zod';
import { nameSchema, orderSchema, parentIdSchema, slugSchema } from '../../../schema/zod/category/field.schema.js';

export const createDTO = z.object({
  name: nameSchema,
  parentId: parentIdSchema,
  slug: slugSchema,
  order: orderSchema
});

export type CreateDTO = z.infer<typeof createDTO>;
