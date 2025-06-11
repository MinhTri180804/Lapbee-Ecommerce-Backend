import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant';

const {
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  PHONE_REQUIRED,
  USER_AUTH_ID_REQUIRED,
  PHONE_INVALID,
  LAST_NAME_MIN_LENGTH,
  FIRST_NAME_MIN_LENGTH
} = ValidationMessages.userProfile;

const REGEX_VALIDATE_NUMBER_PHONE = /^(0|\+84)(3|5|7|8|9)([0-9]{8})$/;

export const userAuthIdSchema = z.string({ required_error: USER_AUTH_ID_REQUIRED });
export const firstNameSchema = z.string({ required_error: FIRST_NAME_REQUIRED }).min(3, FIRST_NAME_MIN_LENGTH);
export const lastNameSchema = z.string({ required_error: LAST_NAME_REQUIRED }).min(3, LAST_NAME_MIN_LENGTH);
export const avatarUrlSchema = z.string();
export const phoneSchema = z
  .string({ required_error: PHONE_REQUIRED })
  .regex(REGEX_VALIDATE_NUMBER_PHONE, PHONE_INVALID);
