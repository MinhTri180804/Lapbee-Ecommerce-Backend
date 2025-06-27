import { z } from 'zod';
import { ValidationMessages } from '../../../../../constants/validationMessages.constant.js';
import { StateProductEnum } from '../../../../../enums/stateProduct.enum.js';

const { SLUG_REQUIRED } = ValidationMessages.api.request.external.cloudinary.uploadNewProductImage;

export const uploadProductImageDTO = z.object({
  slug: z.string({ required_error: SLUG_REQUIRED }),
  state: z.coerce.number().pipe(z.nativeEnum(StateProductEnum))
});

export type UploadProductImageDTO = z.infer<typeof uploadProductImageDTO>;
