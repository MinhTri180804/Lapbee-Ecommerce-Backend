import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';

const { NEW_ORDER_REQUIRED } = ValidationMessages.api.request.category.changeOrder;

export const changeOrderDTO = z.object({
  newOrder: z.number({ required_error: NEW_ORDER_REQUIRED })
});

export type ChangeOrderDTO = z.infer<typeof changeOrderDTO>;
