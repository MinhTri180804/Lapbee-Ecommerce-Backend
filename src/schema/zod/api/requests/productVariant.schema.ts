import { z } from 'zod';
import { ValidationMessages } from '../../../../constants/validationMessages.constant.js';
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
} from '../../productVariant/field.schema.js';

const { SKU_REQUIRED } = ValidationMessages.api.request.productVariant;

export const createProductVariantRequestBodySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  specs: z.array(specsSchema),
  sku: z.string({ required_error: SKU_REQUIRED }),
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
  optionValues: z.array(optionValuesSchema)
});

export const createManyProductsVariantRequestBodySchema = z.object({
  productsVariant: z.array(createProductVariantRequestBodySchema)
});

export type CreateProductVariantRequestBody = z.infer<typeof createProductVariantRequestBodySchema>;
export type CreateManyProductsVariantRequestBody = z.infer<typeof createManyProductsVariantRequestBodySchema>;
