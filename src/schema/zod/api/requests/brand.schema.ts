import { z } from 'zod';
import { brandZodSchema } from '../../brand/index.schema.js';
import { bannersSchema, logoSchema, nameSchema } from '../../brand/field.schema.js';

export const createBrandRequestBodySchema = brandZodSchema;
export const updateBrandRequestBodySchema = z.object({
  name: nameSchema.optional(),
  logo: logoSchema.optional(),
  banners: bannersSchema.optional()
});

export type CreateBrandRequestBodySchema = z.infer<typeof createBrandRequestBodySchema>;
export type UpdateBrandRequestBodySchema = z.infer<typeof updateBrandRequestBodySchema>;
