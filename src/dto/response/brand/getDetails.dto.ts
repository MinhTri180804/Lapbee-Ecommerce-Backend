import { z } from 'zod';
import { brandZodSchema } from '../../../schema/zod/brand/index.schema.js';
import { timestampsSchema } from '../../common.dto.js';

export const getDetailsDTO = z
  .object({
    id: z.string(),
    name: brandZodSchema.shape.name,
    slug: brandZodSchema.shape.slug,
    logo: brandZodSchema.shape.logo,
    banners: brandZodSchema.shape.banners
  })
  .merge(timestampsSchema);

export type GetDetailsDTO = z.infer<typeof getDetailsDTO>;
