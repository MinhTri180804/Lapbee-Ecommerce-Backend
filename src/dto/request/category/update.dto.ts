import { z, ZodIssueCode } from 'zod';
import { nameSchema, orderSchema, parentIdSchema, slugSchema } from '../../../schema/zod/category/field.schema.js';

export const updateDTO = z
  .object({
    name: nameSchema.optional(),
    parentId: parentIdSchema.optional(),
    slug: slugSchema.optional(),
    order: orderSchema.optional()
  })
  .superRefine(({ name, slug }, ctx) => {
    // TODO: Optimization logic validate
    if (name && !slug) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Update name but not update slug, update name with slug is required'
      });
    }

    if (slug && !name) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Update slug but not update name, update slug with name is required'
      });
    }
  });

export type UpdateDTO = z.infer<typeof updateDTO>;
