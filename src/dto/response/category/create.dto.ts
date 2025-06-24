import { timestampsSchema } from '../../common.dto.js';
import { categoryZodSchema } from './../../../schema/zod/category/index.schema.js';
import { z } from 'zod';

export const createDTO = z
  .object({
    id: z.string(),
    name: categoryZodSchema.shape.name,
    parentId: categoryZodSchema.shape.parentId,
    slug: categoryZodSchema.shape.slug,
    hashChildren: categoryZodSchema.shape.hasChildren,
    order: categoryZodSchema.shape.order
  })
  .merge(timestampsSchema);

export type CreateDTO = z.infer<typeof createDTO>;
