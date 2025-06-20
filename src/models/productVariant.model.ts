import { Document, model, Schema, Types } from 'mongoose';
import { ProductVariantZodSchemaType } from '../schema/zod/productVariant/index.schema.js';
import { StatusProductVariantEnum } from '../enums/statusProductVariant.enum.js';

const DOCUMENT_NAME = 'product_variant';
const COLLECTION_NAME = 'products_variant';

export interface IProductVariantDocument extends ProductVariantZodSchemaType, Document {}

const specsSchema = new Schema<IProductVariantDocument['specs'][0]>({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const seoSchema = new Schema<IProductVariantDocument['seo']>({
  metaTitle: {
    type: String,
    required: true
  },
  metaDescription: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    required: true
  },
  robots: {
    type: String,
    required: true
  },
  ogTitle: {
    type: String,
    required: true
  },
  ogDescription: {
    type: String,
    required: true
  },
  ogImage: {
    type: String,
    required: true
  }
});

const imagesSchema = new Schema<IProductVariantDocument['images'][0]>({
  publicId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const productVariantSchema = new Schema<IProductVariantDocument>(
  {
    name: {
      type: String,
      required: true
    },
    productId: {
      type: Types.ObjectId,
      ref: 'product',
      required: true,
      index: true
    },
    specs: {
      type: [specsSchema],
      default: []
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    seo: {
      type: seoSchema,
      required: true
    },
    originPrice: {
      type: Number,
      required: true
    },
    salePrice: {
      type: Number,
      default: null
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isSale: {
      type: Boolean,
      default: false
    },
    costPrice: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    relatedBlogId: {
      type: [Types.ObjectId],
      ref: 'blog',
      default: []
    },
    suggestProductVariantId: {
      type: [Types.ObjectId],
      ref: DOCUMENT_NAME
    },
    relatedProductVariantId: {
      type: [Types.ObjectId],
      ref: DOCUMENT_NAME
    },
    status: {
      type: Number,
      enum: StatusProductVariantEnum,
      required: true
    },
    images: {
      type: [imagesSchema],
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export const ProductVariant = model<IProductVariantDocument>(DOCUMENT_NAME, productVariantSchema);
