import { z } from 'zod';

export const fileResourceDTOSchema = z.object({
  assetId: z.string(),
  publicId: z.string(),
  format: z.string(),
  resourceType: z.string(),
  createdAt: z.string(),
  bytes: z.number(),
  assetFolder: z.string(),
  displayName: z.string(),
  width: z.number(),
  height: z.number(),
  secureUrl: z.string()
});

export const metadataFileSchema = z.object({
  nextCursor: z.string().nullable(),
  rateLimitAllowed: z.number(),
  rateLimitResetAt: z.string(),
  rateLimitRemaining: z.number()
});

export type FileResourceDTO = z.infer<typeof fileResourceDTOSchema>;
export type MetadataFileSchema = z.infer<typeof metadataFileSchema>;
