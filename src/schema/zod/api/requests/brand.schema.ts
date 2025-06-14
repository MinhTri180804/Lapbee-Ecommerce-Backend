import { z } from 'zod';
import { brandZodSchema } from '../../brand/index.schema.js';

export const createBrandRequestBodySchema = brandZodSchema;

export type CreateBrandRequestBodySchema = z.infer<typeof createBrandRequestBodySchema>;
