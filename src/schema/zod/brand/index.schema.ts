import { z } from 'zod';
import { bannersSchema, logoSchema, nameSchema, slugSchema } from './field.schema.js';
import { objectIdSchema } from '../commons.schema.js';

export const brandZodSchema = z.object({
  _id: objectIdSchema,
  name: nameSchema,
  logo: logoSchema.nullable(),
  slug: slugSchema,
  banners: z.array(bannersSchema)
});

export type BrandSchemaType = z.infer<typeof brandZodSchema>;
