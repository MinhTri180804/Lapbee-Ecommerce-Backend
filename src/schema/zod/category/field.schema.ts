import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';

const { SLUG_REQUIRED, NAME_REQUIRED, ORDER_REQUIRED } = ValidationMessages.category;

export const nameSchema = z.string({ required_error: NAME_REQUIRED });
export const slugSchema = z.string({ required_error: SLUG_REQUIRED });
export const hasChildrenSchema = z.boolean();
export const orderSchema = z.number({ required_error: ORDER_REQUIRED });
export const parentIdSchema = z.string();
