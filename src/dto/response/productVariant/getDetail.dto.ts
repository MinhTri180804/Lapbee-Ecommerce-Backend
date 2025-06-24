import { brandZodSchema } from 'src/schema/zod/brand/index.schema.js';
import { categoryZodSchema } from 'src/schema/zod/category/index.schema.js';
import { z } from 'zod';
import { productZodSchema } from '../../../schema/zod/product/index.schema.js';
import { productVariantZodSchema } from '../../../schema/zod/productVariant/index.schema.js';
import { timestampsSchema } from '../../../dto/common.dto.js';

const productVariant = z
  .object({
    id: z.string(),
    name: productVariantZodSchema.shape.name,
    slug: productVariantZodSchema.shape.slug,
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
    optionValues: productVariantZodSchema.shape.optionValues,
    description: productVariantZodSchema.shape.description
  })
  .merge(timestampsSchema);

const categorySchema = categoryZodSchema
  .pick({
    name: true,
    slug: true
  })
  .extend({
    id: z.string()
  });

const brandSchema = brandZodSchema
  .pick({
    name: true,
    logo: true
  })
  .extend({
    id: z.string()
  });

const stateSchema = z.object({
  code: productZodSchema.shape.state,
  name: z.string()
});

const product = z
  .object({
    id: z.string(),
    name: productZodSchema.shape.name,
    category: categorySchema.nullable(),
    brand: brandSchema.nullable(),
    commonImages: productZodSchema.shape.commonImages,
    commonSpecs: productZodSchema.shape.commonSpecs,
    state: stateSchema,
    newInfo: productZodSchema.shape.newInfo,
    usedInfo: productZodSchema.shape.usedInfo,
    options: productZodSchema.shape.options,
    description: productVariantZodSchema.shape.description
  })
  .merge(timestampsSchema);

export const getDetailsDTO = z.object({
  productOrigin: product,
  productVariant: productVariant
});

export type GetDetailsDTO = z.infer<typeof getDetailsDTO>;
