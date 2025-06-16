import { Document, model, Schema } from 'mongoose';
import { CategorySchemaType } from '../schema/zod/category/index.schema.js';

const DOCUMENT_NAME = 'category';
const COLLECTION_NAME = 'categories';

export interface ICategoryDocument extends Document, CategorySchemaType {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true
    },
    parentId: {
      type: String,
      default: null
    },
    slug: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export const Category = model<ICategoryDocument>(DOCUMENT_NAME, categorySchema);
