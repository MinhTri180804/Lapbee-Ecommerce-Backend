import { z } from 'zod';

export const compressingImageFromUrlDTO = z.object({
  url: z.string({ required_error: 'URL is required' })
});

export type CompressingImageFromUrlDTO = z.infer<typeof compressingImageFromUrlDTO>;
