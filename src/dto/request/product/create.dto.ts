import { z, ZodIssueCode } from 'zod';
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
  usedInfoSchema,
  slugSchema
} from '../../../schema/zod/product/field.schema.js';
import { StateProductEnum } from '../../../enums/stateProduct.enum.js';

export const createDTO = z
  .object({
    categoryId: categoryIdSchema.nullable(),
    name: nameSchema,
    slug: slugSchema,
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

export type CreateDTO = z.infer<typeof createDTO>;
