import { z } from 'zod';
import { categoryZodSchema } from '../../../schema/zod/category/index.schema.js';
import { timestampsSchema } from '../../common.dto.js';

const categorySchema = z
  .object({
    id: z.string(),
    name: categoryZodSchema.shape.name,
    slug: categoryZodSchema.shape.slug,
    parentId: categoryZodSchema.shape.parentId,
    hasChildren: categoryZodSchema.shape.hasChildren,
    order: categoryZodSchema.shape.order
  })
  .merge(timestampsSchema);

// eslint-disable-next-line
const categoryChildrenSchema: any = categorySchema
  .extend({
    children: z.array(z.lazy(() => categoryChildrenSchema))
  })
  .optional();

export const getAllTreeDTO = z.array(
  categorySchema.merge(
    z.object({
      children: z.array(z.lazy(() => categoryChildrenSchema)).optional()
    })
  )
);

export type GetAllTreeDTO = z.infer<typeof getAllTreeDTO>;
