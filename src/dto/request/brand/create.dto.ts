import { z } from 'zod';
import { bannersSchema, logoSchema, nameSchema, slugSchema } from '../../../schema/zod/brand/field.schema.js';

export const createDTO = z.object({
  name: nameSchema,
  logo: logoSchema,
  banners: z.array(bannersSchema),
  slug: slugSchema
});

export type CreateDTO = z.infer<typeof createDTO>;
