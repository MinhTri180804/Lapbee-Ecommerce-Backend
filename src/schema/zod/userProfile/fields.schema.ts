import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant';

const { FIRST_NAME_REQUIRED, LAST_NAME_REQUIRED, PHONE_REQUIRED, USER_AUTH_ID_REQUIRED } =
  ValidationMessages.userProfile;

export const userAuthIdSchema = z.string({ required_error: USER_AUTH_ID_REQUIRED });
export const firstNameSchema = z.string({ required_error: FIRST_NAME_REQUIRED });
export const lastNameSchema = z.string({ required_error: LAST_NAME_REQUIRED });
export const avatarUrlSchema = z.string();
export const phoneSchema = z.string({ required_error: PHONE_REQUIRED });
