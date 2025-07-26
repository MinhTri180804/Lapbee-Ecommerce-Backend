import { z } from 'zod';

export const uploadFileResourcesFromLinkDTO = z.object({
  link: z.string(),
  folderPath: z.string(),
  filename: z.string().nonempty()
});

export type UploadFileResourcesFromLinkDTO = z.infer<typeof uploadFileResourcesFromLinkDTO>;
