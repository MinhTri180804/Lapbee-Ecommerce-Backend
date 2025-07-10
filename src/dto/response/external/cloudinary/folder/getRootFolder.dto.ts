import { z } from 'zod';

const folderSchema = z.object({
  name: z.string(),
  path: z.string(),
  externalId: z.string()
});

export const getRootFolderDTO = z.object({
  data: z.array(folderSchema),
  metadata: z.object({
    nextCursor: z.string().nullable(),
    totalCount: z.number(),
    rateLimitAllowed: z.number(),
    rateLimitResetAt: z.string(),
    rateLimitRemaining: z.number()
  })
});

export type GetRootFolderDTO = z.infer<typeof getRootFolderDTO>;
