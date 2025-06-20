import { z, ZodIssueCode } from 'zod';
import {
  commonSpecsSchema,
  brandIdSchema,
  categoryIdSchema,
  commonImagesSchema,
  descriptionSchema,
  nameSchema,
  stateSchema,
  usedInfoSchema
} from '../../product/field.schema.js';
import { StateProductEnum } from '../../../../enums/stateProduct.enum.js';

export const createProductRequestBodySchema = z
  .object({
    categoryId: categoryIdSchema.nullable(),
    name: nameSchema,
    commonImages: z.array(commonImagesSchema),
    commonSpecs: z.array(commonSpecsSchema),
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

export type CreateProductRequestBody = z.infer<typeof createProductRequestBodySchema>;
