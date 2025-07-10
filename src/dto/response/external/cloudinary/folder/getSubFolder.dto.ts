import { z } from 'zod';
import { folderSchema, metadataFolderSchema } from './commons.dto.js';

export const getSubFolderDTO = z.object({
  data: z.array(folderSchema),
  metadata: metadataFolderSchema
});

export type GetSubFolderDTO = z.infer<typeof getSubFolderDTO>;
