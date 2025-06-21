import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';
import { editorJsSchema } from '../commons.schema.js';
import { StatusProductVariantEnum } from '../../../enums/statusProductVariant.enum.js';
import { StateProductEnum } from 'src/enums/stateProduct.enum.js';

const {
  PRODUCT_ID_REQUIRED,
  SKU_REQUIRED,
  SOLD_REQUIRED,
  STATUS_REQUIRED,
  STOCK_REQUIRED,
  COST_PRICE_REQUIRED,
  ORIGIN_PRICE_REQUIRED,
  NAME_EMPTY: PRODUCT_VARIANT_NAME_EMPTY,
  NAME_REQUIRED: PRODUCT_VARIANT_NAME_REQUIRED,
  CATEGORY_ID_REQUIRED,
  BRAND_ID_REQUIRED,
  STATE_REQUIRED,
  SLUG_EMPTY,
  SKU_EMPTY,
  SLUG_REQUIRED
} = ValidationMessages.productVariant;

const { NAME_REQUIRED, VALUE_REQUIRED } = ValidationMessages.productVariant.spec;

const {
  META_DESCRIPTION_REQUIRED,
  META_TITLE_REQUIRED,
  KEYWORDS_REQUIRED,
  ROBOTS_REQUIRED,
  OG_DESCRIPTION_REQUIRED,
  OG_IMAGE_REQUIRED,
  OG_TITLE_REQUIRED
} = ValidationMessages.productVariant.seo;

const { PUBLIC_ID_REQUIRED, URL_REQUIRED } = ValidationMessages.productVariant.images;

const {
  NAME_REQUIRED: OPTION_VALUES_NAME_REQUIRED,
  VALUE_REQUIRED: OPTION_VALUES_VALUE_REQUIRED,
  NAME_EMPTY: OPTION_VALUES_NAME_EMPTY,
  VALUE_EMPTY: OPTION_VALUES_VALUE_EMPTY
} = ValidationMessages.productVariant.optionValues;

export const nameSchema = z
  .string({ required_error: PRODUCT_VARIANT_NAME_REQUIRED })
  .min(1, PRODUCT_VARIANT_NAME_EMPTY);
export const slugSchema = z.string({ required_error: SLUG_REQUIRED }).min(1, SLUG_EMPTY);
export const productIdSchema = z
  .string({ required_error: PRODUCT_ID_REQUIRED })
  .refine((value) => !isValidObjectId(value), {
    message: 'Invalid objectId of productId'
  });
export const specsSchema = z.object({
  name: z.string({ required_error: NAME_REQUIRED }),
  value: z.string({ required_error: VALUE_REQUIRED })
});
export const skuSchema = z.string({ required_error: SKU_REQUIRED }).min(1, SKU_EMPTY);
export const seoSchema = z.object({
  metaTitle: z.string({ required_error: META_TITLE_REQUIRED }),
  metaDescription: z.string({ required_error: META_DESCRIPTION_REQUIRED }),
  keywords: z.string({ required_error: KEYWORDS_REQUIRED }),
  robots: z.string({ required_error: ROBOTS_REQUIRED }),
  ogTitle: z.string({ required_error: OG_TITLE_REQUIRED }),
  ogDescription: z.string({ required_error: OG_DESCRIPTION_REQUIRED }),
  ogImage: z.string({ required_error: OG_IMAGE_REQUIRED })
});
export const originPriceSchema = z.number({ required_error: ORIGIN_PRICE_REQUIRED }).nonnegative();
export const salePriceSchema = z.number().nonnegative();
export const descriptionSchema = editorJsSchema;
export const isSaleSchema = z.boolean();
export const isFeaturedSchema = z.boolean();
export const costPriceSchema = z.number({ required_error: COST_PRICE_REQUIRED }).nonnegative();
export const stockSchema = z.number({ required_error: STOCK_REQUIRED }).nonnegative();
export const soldSchema = z.number({ required_error: SOLD_REQUIRED }).nonnegative();
export const relatedBlogIdSchema = z.string();
export const suggestProductVariantIdSchema = z.string();
export const relatedProductVariantIdSchema = z.string();
export const statusSchema = z.nativeEnum(StatusProductVariantEnum, { required_error: STATUS_REQUIRED });
export const imagesSchema = z.object({
  publicId: z.string({ required_error: PUBLIC_ID_REQUIRED }),
  url: z.string({ required_error: URL_REQUIRED })
});
export const categoryIdSchema = z
  .string({ required_error: CATEGORY_ID_REQUIRED })
  .refine((value) => !isValidObjectId(value), { message: 'Invalid objectID of categoryId' });
export const brandIdSchema = z
  .string({ required_error: BRAND_ID_REQUIRED })
  .refine((value) => !isValidObjectId(value), { message: 'Invalid ObjectId of brandId' });
export const optionValuesSchema = z.object({
  name: z.string({ required_error: OPTION_VALUES_NAME_REQUIRED }).min(1, OPTION_VALUES_NAME_EMPTY),
  value: z.string({ required_error: OPTION_VALUES_VALUE_REQUIRED }).min(1, OPTION_VALUES_VALUE_EMPTY)
});
export const stateSchema = z.nativeEnum(StateProductEnum, { required_error: STATE_REQUIRED });
