import { z } from 'zod';
import { bannersSchema, logoSchema, nameSchema, slugSchema } from '../../brand/field.schema.js';

export const createBrandRequestBodySchema = z.object({
  name: nameSchema,
  logo: logoSchema,
  banners: z.array(bannersSchema),
  slug: slugSchema
});

export const updateBrandRequestBodySchema = z.object({
  name: nameSchema.optional(),
  logo: logoSchema.optional(),
  banners: bannersSchema.optional()
});

export type CreateBrandRequestBody = z.infer<typeof createBrandRequestBodySchema>;
export type UpdateBrandRequestBody = z.infer<typeof updateBrandRequestBodySchema>;
