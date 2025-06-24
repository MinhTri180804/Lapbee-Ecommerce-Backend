import { z } from 'zod';
import {
  costPriceSchema,
  descriptionSchema,
  imagesSchema,
  isFeaturedSchema,
  isSaleSchema,
  nameSchema,
  optionValuesSchema,
  originPriceSchema,
  relatedBlogIdSchema,
  relatedProductVariantIdSchema,
  salePriceSchema,
  seoSchema,
  slugSchema,
  soldSchema,
  specsSchema,
  statusSchema,
  stockSchema,
  suggestProductVariantIdSchema
} from '../../../schema/zod/productVariant/field.schema.js';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';

const { SKU_REQUIRED } = ValidationMessages.api.request.productVariant;

export const createDTO = z.object({
  name: nameSchema,
  slug: slugSchema,
  specs: z.array(specsSchema).default([]),
  sku: z.string({ required_error: SKU_REQUIRED }),
  seo: seoSchema,
  originPrice: originPriceSchema,
  salePrice: salePriceSchema.nullable().default(null),
  description: descriptionSchema.nullable().default(null),
  isSale: isSaleSchema,
  isFeatured: isFeaturedSchema,
  costPrice: costPriceSchema,
  stock: stockSchema,
  sold: soldSchema,
  relatedBlogId: z.array(relatedBlogIdSchema),
  relatedProductVariantId: z.array(relatedProductVariantIdSchema),
  suggestProductVariantId: z.array(suggestProductVariantIdSchema),
  status: statusSchema,
  images: z.array(imagesSchema),
  optionValues: z.array(optionValuesSchema).default([])
});

export type CreateDTO = z.infer<typeof createDTO>;
