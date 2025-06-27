import { z } from 'zod';

export const uploadBannerDTO = z.object({
  url: z.string(),
  publicId: z.string()
});

export type UploadBannerDTO = z.infer<typeof uploadBannerDTO>;
