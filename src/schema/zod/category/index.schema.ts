import { z } from 'zod';
import { hasChildrenSchema, nameSchema, orderSchema, parentIdSchema, slugSchema } from './field.schema.js';

export const categoryZodSchema = z.object({
  parentId: parentIdSchema.nullable(),
  name: nameSchema,
  slug: slugSchema,
  hasChildren: hasChildrenSchema.default(false),
  order: orderSchema
});

export type CategorySchemaType = z.infer<typeof categoryZodSchema>;
