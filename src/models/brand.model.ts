import { model, Schema, Document, Types } from 'mongoose';
import { BrandSchemaType } from '../schema/zod/brand/index.schema.js';
import { ITimestamp } from '../types/commons.type.js';

const DOCUMENT_NAME = 'brand';
const COLLECTION_NAME = 'brands';

export interface IBrandDocument extends Document<Types.ObjectId>, Omit<BrandSchemaType, '_id'>, ITimestamp {}

const bannersSchema = new Schema<IBrandDocument['banners'][0]>(
  {
    publicId: {
      type: String
    },
    isMain: {
      type: Boolean,
      default: false
    },
    url: {
      type: String
    }
  },
  {
    _id: false
  }
);

const logoSchema = new Schema<IBrandDocument['logo']>(
  {
    publicId: {
      type: String
    },
    url: {
      type: String
    }
  },
  {
    _id: false
  }
);

const brandSchema = new Schema<IBrandDocument>(
  {
    name: {
      type: String
    },
    logo: {
      type: logoSchema,
      default: null
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    banners: {
      type: [bannersSchema],
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export const Brand = model<IBrandDocument>(DOCUMENT_NAME, brandSchema);
