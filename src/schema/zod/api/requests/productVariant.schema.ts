import { z } from 'zod';
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
  soldSchema,
  specsSchema,
  statusSchema,
  stockSchema,
  suggestProductVariantIdSchema
} from '../../productVariant/field.schema.js';
import { ValidationMessages } from '../../../../constants/validationMessages.constant.js';

const { SKU_REQUIRED } = ValidationMessages.api.request.productVariant;

export const createProductVariantRequestBodySchema = z.object({
  name: nameSchema,
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
  images: z.array(imagesSchema)
});

export type CreateProductVariantRequestBody = z.infer<typeof createProductVariantRequestBodySchema>;
