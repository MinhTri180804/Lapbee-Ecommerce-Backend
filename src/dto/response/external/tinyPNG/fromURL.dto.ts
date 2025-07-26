import { z } from 'zod';

export const compressingImageFromUrlDTO = z.object({
  input: z.object({
    size: z.number(),
    type: z.string()
  }),
  output: z.object({
    size: z.number(),
    type: z.string(),
    ratio: z.number(),
    url: z.string()
  })
});

export type CompressingImageFromUrlDTO = z.infer<typeof compressingImageFromUrlDTO>;
