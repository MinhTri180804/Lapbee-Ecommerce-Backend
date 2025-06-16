import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';

const { SLUG_REQUIRED, NAME_REQUIRED } = ValidationMessages.category;

export const nameSchema = z.string({ required_error: NAME_REQUIRED });
export const slugSchema = z.string({ required_error: SLUG_REQUIRED });
export const parentIdSchema = z.string();
