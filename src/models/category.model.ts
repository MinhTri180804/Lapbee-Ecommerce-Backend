import { Document, model, Schema, Types } from 'mongoose';
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
      type: Types.ObjectId,
      ref: DOCUMENT_NAME,
      default: null
    },
    slug: {
      type: String,
      required: true
    },
    hasChildren: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export const Category = model<ICategoryDocument>(DOCUMENT_NAME, categorySchema);
