import { z } from 'zod';
import { ValidationMessages } from '../../../../../constants/validationMessages.constant.js';

const { NAME_BRAND_REQUIRED } = ValidationMessages.api.request.external.cloudinary.uploadBrandLogo;

export const uploadLogoDTO = z.object({
  nameBrand: z.string({ required_error: NAME_BRAND_REQUIRED })
});

export type UploadLogoDTO = z.infer<typeof uploadLogoDTO>;
