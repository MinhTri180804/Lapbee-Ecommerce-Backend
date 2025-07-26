import { z } from 'zod';
import { folderSchema, metadataFolderSchema } from './commons.dto.js';

export const getRootFolderDTO = z.object({
  data: z.array(folderSchema),
  metadata: metadataFolderSchema
});

export type GetRootFolderDTO = z.infer<typeof getRootFolderDTO>;
