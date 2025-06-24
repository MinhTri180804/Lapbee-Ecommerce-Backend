import { z } from 'zod';
import { categoryZodSchema } from '../../../schema/zod/category/index.schema.js';
import { timestampsSchema } from '../../common.dto.js';

const categorySchema = z
  .object({
    id: z.string(),
    name: categoryZodSchema.shape.name,
    parentId: categoryZodSchema.shape.parentId,
    slug: categoryZodSchema.shape.slug,
    hashChildren: categoryZodSchema.shape.hasChildren,
    order: categoryZodSchema.shape.order
  })
  .merge(timestampsSchema);

export const getAllDTO = z.array(categorySchema);

export type GetAllDTO = z.infer<typeof getAllDTO>;
