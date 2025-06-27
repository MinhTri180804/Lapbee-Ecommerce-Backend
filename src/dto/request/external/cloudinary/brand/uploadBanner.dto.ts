import { z } from 'zod';
import { ValidationMessages } from '../../../../../constants/validationMessages.constant.js';

const { NAME_BRAND_REQUIRED } = ValidationMessages.api.request.external.cloudinary.uploadBannerBrand;

export const uploadBannerDTO = z.object({
  nameBrand: z.string({ required_error: NAME_BRAND_REQUIRED })
});

export type UploadBannerDTO = z.infer<typeof uploadBannerDTO>;
