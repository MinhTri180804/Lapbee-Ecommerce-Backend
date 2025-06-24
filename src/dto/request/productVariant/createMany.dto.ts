import { z } from 'zod';
import { createDTO } from './create.dto.js';

export const createManyDTO = z.object({
  productsVariant: z.array(createDTO)
});

export type CreateManyDTO = z.infer<typeof createManyDTO>;
