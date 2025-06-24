import { z } from 'zod';
import { ValidationMessages } from '../../../constants/validationMessages.constant.js';

const { PARENT_ID_REQUIRED } = ValidationMessages.api.request.category.changeParentId;

export const changeParentIdDTO = z.object({
  newParentId: z.string({ required_error: PARENT_ID_REQUIRED })
});

export type ChangeParentIdDTO = z.infer<typeof changeParentIdDTO>;
