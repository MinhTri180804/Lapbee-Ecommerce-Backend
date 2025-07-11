import { z } from 'zod';
import { fileResourceDTOSchema, metadataFileSchema } from './commons.dto.js';

export const getAllFileResourcesDTO = z.object({
  data: z.array(fileResourceDTOSchema),
  metadata: metadataFileSchema
});

export type GetAllFileResourcesDTO = z.infer<typeof getAllFileResourcesDTO>;
