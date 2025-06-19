import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';
import { StateProductEnum } from '../../../enums/stateProduct.enum.js';
import { PhysicalConditionProductEnum } from '../../../enums/physicalConditionProduct.enum.js';
import { editorJsSchema } from '../commons.schema.js';

const {
  CATEGORY_ID_REQUIRED,
  NAME_REQUIRED,
  BRAND_ID_REQUIRED,
  STATE_REQUIRED,
  PHYSICAL_CONDITION_REQUIRED,
  PUBLIC_ID_REQUIRED,
  NAME_ATTRIBUTE_REQUIRED,
  VALUE_ATTRIBUTE_REQUIRED,
  URL_REQUIRED
} = ValidationMessages.product;

export const categoryIdSchema = z.string({ required_error: CATEGORY_ID_REQUIRED });
// TODO: Implement createdBySchema later

export const nameSchema = z.string({ required_error: NAME_REQUIRED });
export const commonImagesSchema = z.object({
  publicId: z.string({ required_error: PUBLIC_ID_REQUIRED }),
  url: z.string({ required_error: URL_REQUIRED })
});
export const attributesSchema = z.object({
  name: z.string({ required_error: NAME_ATTRIBUTE_REQUIRED }),
  value: z.string({ required_error: VALUE_ATTRIBUTE_REQUIRED })
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
