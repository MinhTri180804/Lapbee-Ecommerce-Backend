import { z } from 'zod';
import { productVariantZodSchema } from '../../../schema/zod/productVariant/index.schema.js';

export const createDTO = z.object({
  id: z.string(),
  name: productVariantZodSchema.shape.name,
  slug: productVariantZodSchema.shape.slug,
  productId: z.string(),
  specs: productVariantZodSchema.shape.specs,
  sku: productVariantZodSchema.shape.sku,
  seo: productVariantZodSchema.shape.seo,
  originPrice: productVariantZodSchema.shape.originPrice,
  salePrice: productVariantZodSchema.shape.salePrice,
  stock: productVariantZodSchema.shape.stock,
  sold: productVariantZodSchema.shape.sold,
  relatedBlogId: productVariantZodSchema.shape.relatedBlogId,
  relatedProductVariantId: productVariantZodSchema.shape.relatedProductVariantId,
  suggestProductVariantId: productVariantZodSchema.shape.suggestProductVariantId,
  status: z.object({
    code: productVariantZodSchema.shape.status,
    name: z.string()
  }),
  images: productVariantZodSchema.shape.images,
  categoryId: z.string(),
  brandId: z.string(),
  state: z.object({
    code: productVariantZodSchema.shape.state,
    name: z.string()
  }),
  optionValues: productVariantZodSchema.shape.optionValues
});

export type CreateDTO = z.infer<typeof createDTO>;
