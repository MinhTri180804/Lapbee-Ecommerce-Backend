import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';
import { StateProductEnum } from '../../../enums/stateProduct.enum.js';
import { PhysicalConditionProductEnum } from '../../../enums/physicalConditionProduct.enum.js';
import { editorJsSchema } from '../commons.schema.js';

const {
  CATEGORY_ID_REQUIRED,
  NAME_REQUIRED,
  NAME_EMPTY,
  BRAND_ID_REQUIRED,
  STATE_REQUIRED,
  PHYSICAL_CONDITION_REQUIRED,
  PUBLIC_ID_REQUIRED,
  PUBLIC_ID_EMPTY,
  NAME_SPECS_REQUIRED,
  NAME_SPECS_EMPTY,
  VALUE_SPECS_REQUIRED,
  VALUE_SPECS_EMPTY,
  URL_REQUIRED,
  URL_EMPTY,
  newInfo: {
    TYPE_PRODUCT_REQUIRED,
    CONDITION_PRODUCT_REQUIRED,
    WARRANTY_LEFT_REQUIRED,
    PRICE_INFO_REQUIRED,
    TYPE_PRODUCT_EMPTY,
    CONDITION_PRODUCT_EMPTY,
    WARRANTY_LEFT_EMPTY,
    PRICE_INFO_EMPTY
  },
  options: { NAME_REQUIRED: OPTIONS_NAME_REQUIRED }
} = ValidationMessages.product;

export const categoryIdSchema = z.string({ required_error: CATEGORY_ID_REQUIRED });
// TODO: Implement createdBySchema later

export const nameSchema = z.string({ required_error: NAME_REQUIRED }).min(1, NAME_EMPTY);
export const commonImagesSchema = z.object({
  publicId: z.string({ required_error: PUBLIC_ID_REQUIRED }).min(1, PUBLIC_ID_EMPTY),
  url: z.string({ required_error: URL_REQUIRED }).min(1, URL_EMPTY)
});
export const commonSpecsSchema = z.object({
  name: z.string({ required_error: NAME_SPECS_REQUIRED }).min(1, NAME_SPECS_EMPTY),
  value: z.array(z.string({ required_error: VALUE_SPECS_REQUIRED })).min(1, VALUE_SPECS_EMPTY)
});
export const newInfoSchema = z.object({
  typeProduct: z.string({ required_error: TYPE_PRODUCT_REQUIRED }).min(1, TYPE_PRODUCT_EMPTY),
  productCondition: z.string({ required_error: CONDITION_PRODUCT_REQUIRED }).min(1, CONDITION_PRODUCT_EMPTY),
  warrantyLeft: z.string({ required_error: WARRANTY_LEFT_REQUIRED }).min(1, WARRANTY_LEFT_EMPTY),
  priceInfo: z.string({ required_error: PRICE_INFO_REQUIRED }).min(1, PRICE_INFO_EMPTY)
});
export const brandIdSchema = z.string({ required_error: BRAND_ID_REQUIRED });
export const stateSchema = z.nativeEnum(StateProductEnum, { required_error: STATE_REQUIRED });
export const usedInfoSchema = z.object({
  physicalCondition: z.nativeEnum(PhysicalConditionProductEnum, { required_error: PHYSICAL_CONDITION_REQUIRED }),
  warrantyLeft: z
    .number()
    .int()
    .positive()
    .refine((value) => !isNaN(new Date(value).getTime()), {
      message: 'Invalid timestamp'
    })
    .nullable(),
  note: z.string()
});

export const descriptionSchema = editorJsSchema;
export const optionsSchema = z.object(
  {
    name: z.string({ required_error: OPTIONS_NAME_REQUIRED }),
    values: z.array(z.string()),
    isCompareName: z.boolean()
  },
  { required_error: 'Options Product can not empty' }
);
