import { productVariantZodSchema } from 'src/schema/zod/productVariant/index.schema.js';
import { z } from 'zod';
import { brandZodSchema } from './../../../schema/zod/brand/index.schema.js';
import { categoryZodSchema } from './../../../schema/zod/category/index.schema.js';

const statusSchema = z.object({
  code: productVariantZodSchema.shape.status,
  name: z.string()
});
const stateSchema = z.object({
  code: productVariantZodSchema.shape.state,
  name: z.string()
});
const brandSchema = brandZodSchema
  .pick({
    name: true,
    logo: true
  })
  .extend({
    id: z.string()
  });
const categorySchema = categoryZodSchema
  .pick({
    name: true,
    slug: true
  })
  .extend({
    id: z.string()
  });

export const getAllByProductDTO = z.array(
  z.object({
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
    status: statusSchema,
    images: productVariantZodSchema.shape.images,
    category: categorySchema.nullable(),
    brand: brandSchema.nullable(),
    state: stateSchema,
    optionValues: productVariantZodSchema.shape.optionValues
  })
);

export type GetAllByProductDTO = z.infer<typeof getAllByProductDTO>;
