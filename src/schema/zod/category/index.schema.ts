import { z } from 'zod';
import { nameSchema, parentIdSchema, slugSchema } from './field.schema.js';

export const categoryZodSchema = z.object({
  parentId: parentIdSchema.nullable(),
  name: nameSchema,
  slug: slugSchema
});

export type CategorySchemaType = z.infer<typeof categoryZodSchema>;
