import { z, ZodIssueCode } from 'zod';
import {
  costPriceSchema,
  descriptionSchema,
  imagesSchema,
  isFeaturedSchema,
  isSaleSchema,
  nameSchema,
  originPriceSchema,
  productIdSchema,
  relatedBlogIdSchema,
  relatedProductVariantIdSchema,
  salePriceSchema,
  seoSchema,
  skuSchema,
  soldSchema,
  specsSchema,
  statusSchema,
  stockSchema,
  suggestProductVariantIdSchema
} from './field.schema.js';

export const productVariantZodSchema = z
  .object({
    name: nameSchema,
    productId: productIdSchema.nullable(),
    specs: z.array(specsSchema),
    sku: skuSchema,
    seo: seoSchema,
    originPrice: originPriceSchema,
    salePrice: salePriceSchema.nullable(),
    description: descriptionSchema.nullable(),
    isSale: isSaleSchema,
    isFeatured: isFeaturedSchema,
    costPrice: costPriceSchema,
    stock: stockSchema,
    sold: soldSchema,
    relatedBlogId: z.array(relatedBlogIdSchema),
    suggestProductVariantId: z.array(suggestProductVariantIdSchema),
    relatedProductVariantId: z.array(relatedProductVariantIdSchema),
    status: statusSchema,
    images: z.array(imagesSchema)
  })
  .superRefine(({ isSale, salePrice }, ctx) => {
    if (isSale) {
      if (salePrice === null) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'IsSale is true so sale price can not null'
        });
      }
    }
  });

export type ProductVariantZodSchemaType = z.infer<typeof productVariantZodSchema>;
