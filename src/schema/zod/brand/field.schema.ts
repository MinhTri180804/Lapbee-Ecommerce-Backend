import { ValidationMessages } from '../../../constants/validationMessages.constant.js';
import { z } from 'zod';

const { NAME_REQUIRED, URL_LOGO_REQUIRED, PUBLIC_ID_BANNERS_REQUIRED, PUBLIC_ID_LOGO_REQUIRED, URL_BANNERS_REQUIRED } =
  ValidationMessages.brand;

export const nameSchema = z.string({ required_error: NAME_REQUIRED });
export const logoSchema = z.object({
  publicId: z.string({ required_error: PUBLIC_ID_LOGO_REQUIRED }),
  url: z.string({ required_error: URL_LOGO_REQUIRED })
});
export const bannersSchema = z.object({
  publicId: z.string({ required_error: PUBLIC_ID_BANNERS_REQUIRED }),
  url: z.string({ required_error: URL_BANNERS_REQUIRED }),
  isMain: z.boolean()
});
