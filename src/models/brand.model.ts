import { model, Schema, Document } from 'mongoose';
import { BrandSchemaType } from '../schema/zod/brand/index.schema.js';

const DOCUMENT_NAME = 'brand';
const COLLECTION_NAME = 'brands';

export interface IBrandDocument extends BrandSchemaType, Document {}

const bannersSchema = new Schema<BrandSchemaType['banners'][0]>(
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

const logoSchema = new Schema<BrandSchemaType['logo']>(
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

export const Brand = model(DOCUMENT_NAME, brandSchema);
