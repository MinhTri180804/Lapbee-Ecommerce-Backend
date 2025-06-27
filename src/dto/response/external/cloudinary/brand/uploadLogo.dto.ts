import { z } from 'zod';

export const uploadLogoDTO = z.object({
  url: z.string(),
  publicId: z.string()
});

export type UploadLogoDTO = z.infer<typeof uploadLogoDTO>;
