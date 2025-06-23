import { z } from 'zod';
import {
  brandIdSchema,
  categoryIdSchema,
  commonImagesSchema,
  commonSpecsSchema,
  descriptionSchema,
  nameSchema,
  newInfoSchema,
  optionsSchema,
  stateSchema,
  usedInfoSchema
} from './field.schema.js';
import { objectIdSchema } from '../commons.schema.js';

export const productZodSchema = z.object({
  _id: objectIdSchema,
  categoryId: categoryIdSchema.nullable(),
  // TODO: Implement createdBy later
  name: nameSchema,
  commonImages: z.array(commonImagesSchema).default([]),
  commonSpecs: z.array(commonSpecsSchema).default([]),
  brandId: brandIdSchema.nullable(),
  state: stateSchema,
  newInfo: newInfoSchema.nullable(),
  usedInfo: usedInfoSchema.nullable(),
  description: descriptionSchema.nullable(),
  options: z.array(optionsSchema).nonempty()
});

export type ProductZodSchemaType = z.infer<typeof productZodSchema>;
