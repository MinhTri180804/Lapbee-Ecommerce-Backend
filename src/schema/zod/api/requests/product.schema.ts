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
    newInfo: newInfoSchema.nullable(),
    description: descriptionSchema.nullable(),
    options: z.array(optionsSchema)
  })
  .superRefine(({ state, usedInfo, newInfo }, ctx) => {
    if (state === StateProductEnum.USED) {
      if (usedInfo === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'State product is used, so usedInfo not null'
        });
      }

      if (newInfo) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'State product is used, so newInfo can not has value'
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

      if (usedInfo) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'State product is new, so usedInfo can not has value'
        });
      }
    }
  });

export type CreateProductRequestBody = z.infer<typeof createProductRequestBodySchema>;
