import { z } from 'zod';
import { fileResourceDTOSchema, metadataFileSchema } from './commons.dto.js';

export const searchFileResourcesDTO = z.object({
  data: z.array(fileResourceDTOSchema),
  metadata: metadataFileSchema.merge(
    z.object({
      totalCount: z.number()
    })
  )
});

export type SearchFileResourcesDTO = z.infer<typeof searchFileResourcesDTO>;
