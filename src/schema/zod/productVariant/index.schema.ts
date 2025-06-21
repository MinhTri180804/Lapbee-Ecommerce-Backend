import { z, ZodIssueCode } from 'zod';
import {
  brandIdSchema,
  categoryIdSchema,
  costPriceSchema,
  descriptionSchema,
  imagesSchema,
  isFeaturedSchema,
  isSaleSchema,
  nameSchema,
  optionValuesSchema,
  originPriceSchema,
  productIdSchema,
  relatedBlogIdSchema,
  relatedProductVariantIdSchema,
  salePriceSchema,
  seoSchema,
  skuSchema,
  slugSchema,
  soldSchema,
  specsSchema,
  stateSchema,
  statusSchema,
  stockSchema,
  suggestProductVariantIdSchema
} from './field.schema.js';

export const productVariantZodSchema = z
  .object({
    name: nameSchema,
    slug: slugSchema,
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
    images: z.array(imagesSchema),
    categoryId: categoryIdSchema.nullable(),
    brandId: brandIdSchema.nullable(),
    optionValues: z.array(optionValuesSchema),
    state: stateSchema
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
