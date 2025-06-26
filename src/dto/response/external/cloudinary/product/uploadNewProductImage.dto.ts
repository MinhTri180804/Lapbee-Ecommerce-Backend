import { z } from 'zod';

export const uploadProductImageDTO = z.object({
  publicId: z.string(),
  url: z.string()
});

export type UploadProductImageDTO = z.infer<typeof uploadProductImageDTO>;
