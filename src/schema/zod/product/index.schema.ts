import { z, ZodIssueCode } from 'zod';
import {
  attributesSchema,
  brandIdSchema,
  categoryIdSchema,
  commonImagesSchema,
  descriptionSchema,
  nameSchema,
  stateSchema,
  usedInfoSchema
} from './field.schema.js';
import { StateProductEnum } from '../../../enums/stateProduct.enum.js';

export const productZodSchema = z
  .object({
    categoryId: categoryIdSchema.nullable(),
    name: nameSchema,
    commonImages: z.array(commonImagesSchema).default([]),
    attributes: z.array(attributesSchema).default([]),
    brandId: brandIdSchema.nullable(),
    state: stateSchema,
    usedInfo: usedInfoSchema.nullable(),
    description: descriptionSchema.nullable()
  })
  .superRefine(({ state, usedInfo }, ctx) => {
    if (state === StateProductEnum.USED) {
      if (usedInfo === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'State product is used, so usedInfo not null'
        });
      }
    }
  });

export type ProductZodSchemaType = z.infer<typeof productZodSchema>;
