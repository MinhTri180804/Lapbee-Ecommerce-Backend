import { z } from 'zod';
import { userProfileZodSchema } from '../../../schema/zod/userProfile/index.schema.js';
import { timestampsSchema } from '../../common.dto.js';

export const getMeDTO = z
  .object({
    firstName: userProfileZodSchema.shape.firstName,
    lastName: userProfileZodSchema.shape.lastName,
    avatar: userProfileZodSchema.shape.avatar,
    email: z.string(),
    role: z.number()
  })
  .merge(timestampsSchema);

export type GetMeDTO = z.infer<typeof getMeDTO>;
