import { z } from 'zod';
import { categoryZodSchema } from '../../../schema/zod/category/index.schema.js';
import { timestampsSchema } from '../../common.dto.js';

export const getDetailsDTO = z
  .object({
    id: z.string(),
    name: categoryZodSchema.shape.name,
    parentId: categoryZodSchema.shape.parentId,
    slug: categoryZodSchema.shape.slug,
    hashChildren: categoryZodSchema.shape.hasChildren,
    order: categoryZodSchema.shape.order
  })
  .merge(timestampsSchema);

export type GetDetailsDTO = z.infer<typeof getDetailsDTO>;
