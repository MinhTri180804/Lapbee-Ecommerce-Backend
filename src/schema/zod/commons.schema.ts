import { ObjectId, isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const editorJsSchema = z.object({
  time: z.number().int().positive(),
  version: z.string().nonempty(),
  blocks: z
    .array(
      z.object({
        type: z.string(),
        data: z.record(z.any())
      })
    )
    .nonempty({ message: 'Editor content cannot be empty' })
});

export const objectIdSchema = z.custom<ObjectId>(
  (value) => {
    return isValidObjectId(value);
  },
  {
    message: 'Invalid ObjectId'
  }
);
