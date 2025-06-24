import { z } from 'zod';

export const timestampsSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string()
});
