import { productZodSchema } from '../../../schema/zod/product/index.schema.js';
import { timestampsSchema } from '../../common.dto.js';
import { z } from 'zod';

const stateSchema = z.object({
  code: productZodSchema.shape.state,
  name: z.string()
});

export const createDTO = z
  .object({
    id: z.string(),
    categoryId: productZodSchema.shape.categoryId,
    name: productZodSchema.shape.name,
    slug: productZodSchema.shape.slug,
    commonImages: productZodSchema.shape.commonImages,
    commonSpecs: productZodSchema.shape.commonSpecs,
    state: stateSchema,
    usedInfo: productZodSchema.shape.usedInfo,
    newInfo: productZodSchema.shape.newInfo,
    options: productZodSchema.shape.options,
    description: productZodSchema.shape.description,
    brandId: productZodSchema.shape.brandId
  })
  .merge(timestampsSchema);

export type CreateDTO = z.infer<typeof createDTO>;
