import { z, ZodIssueCode } from 'zod';
import {
  commonSpecsSchema,
  brandIdSchema,
  categoryIdSchema,
  commonImagesSchema,
  descriptionSchema,
  nameSchema,
  stateSchema,
  usedInfoSchema,
  newInfoSchema,
  optionsSchema
} from './field.schema.js';
import { StateProductEnum } from '../../../enums/stateProduct.enum.js';

export const productZodSchema = z
  .object({
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
  })
  .superRefine(({ state, usedInfo, newInfo }, ctx) => {
    if (state === StateProductEnum.USED) {
      if (usedInfo === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'State product is used, so usedInfo not null'
        });
      }
    }

    if (state === StateProductEnum.NEW) {
      if (newInfo === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'State product is new, so newInfo not null'
        });
      }
    }
  });

export type ProductZodSchemaType = z.infer<typeof productZodSchema>;
