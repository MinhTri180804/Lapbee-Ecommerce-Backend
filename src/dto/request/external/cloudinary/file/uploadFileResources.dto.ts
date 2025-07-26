import { z } from 'zod';

export const uploadFileResourcesDTO = z.object({
  folderPath: z.string(),
  rename: z.string().optional()
});

export type UploadFileResourcesDTO = z.infer<typeof uploadFileResourcesDTO>;
