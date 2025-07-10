import { z } from 'zod';

export const folderSchema = z.object({
  name: z.string(),
  path: z.string(),
  externalId: z.string()
});

export const metadataFolderSchema = z.object({
  nextCursor: z.string().nullable(),
  totalCount: z.number(),
  rateLimitAllowed: z.number(),
  rateLimitResetAt: z.string(),
  rateLimitRemaining: z.number()
});

export type FolderSchemaType = z.infer<typeof folderSchema>;
export type MetadataFolderSchema = z.infer<typeof metadataFolderSchema>;
