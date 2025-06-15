import { z } from 'zod';
import { bannersSchema, logoSchema, nameSchema } from './field.schema.js';

export const brandZodSchema = z.object({
  name: nameSchema,
  logo: logoSchema.nullable(),
  banners: z.array(bannersSchema)
});

export type BrandSchemaType = z.infer<typeof brandZodSchema>;
