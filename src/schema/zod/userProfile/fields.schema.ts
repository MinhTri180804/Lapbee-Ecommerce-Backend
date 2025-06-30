import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';
import { objectIdSchema } from '../commons.schema.js';

const {
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  PHONE_REQUIRED,
  PHONE_INVALID,
  LAST_NAME_MIN_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  AVATAR_PUBLIC_ID_REQUIRED,
  AVATAR_URL_REQUIRED
} = ValidationMessages.userProfile;

const REGEX_VALIDATE_NUMBER_PHONE = /^(0|\+84)(3|5|7|8|9)([0-9]{8})$/;

export const userAuthIdSchema = objectIdSchema;
export const firstNameSchema = z.string({ required_error: FIRST_NAME_REQUIRED }).min(3, FIRST_NAME_MIN_LENGTH);
export const lastNameSchema = z.string({ required_error: LAST_NAME_REQUIRED }).min(3, LAST_NAME_MIN_LENGTH);
export const avatarSchema = z.object({
  publicId: z.string({ required_error: AVATAR_PUBLIC_ID_REQUIRED }),
  url: z.string({ required_error: AVATAR_URL_REQUIRED })
});
export const phoneSchema = z
  .string({ required_error: PHONE_REQUIRED })
  .regex(REGEX_VALIDATE_NUMBER_PHONE, PHONE_INVALID);
