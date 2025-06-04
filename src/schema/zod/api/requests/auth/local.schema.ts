import { z } from 'zod';
import { ValidationMessages } from '../../../../../constants/validationMessages.constant.js';

const { EMAIL_REQUIRED, INVALID_EMAIL } = ValidationMessages.userAuth;

export const registerLocalRequestBodySchema = z.object({
  email: z
    .string({
      required_error: EMAIL_REQUIRED
    })
    .email(INVALID_EMAIL)
});

export type RegisterLocalRequestBody = z.infer<typeof registerLocalRequestBodySchema>;
