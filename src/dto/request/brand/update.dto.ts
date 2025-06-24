import { z, ZodIssueCode } from 'zod';
import { bannersSchema, logoSchema, nameSchema, slugSchema } from '../../../schema/zod/brand/field.schema.js';

export const updateDTO = z
  .object({
    name: nameSchema.optional(),
    logo: logoSchema.optional(),
    banners: z.array(bannersSchema).optional(),
    slug: slugSchema.optional()
  })
  .superRefine(({ name, slug }, ctx) => {
    // TODO: Optimization logic validate super refine in here
    if (name) {
      if (!slug) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'Update name but not update slug, update name with slug is required'
        });
      }
    }

    if (slug) {
      if (!name) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'Update slug but not update name, update name with slug is required'
        });
      }
    }
  });

export type UpdateDTO = z.infer<typeof updateDTO>;
