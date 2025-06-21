import { Document, model, Schema, Types } from 'mongoose';
import { ProductZodSchemaType } from '../schema/zod/product/index.schema.js';
import { StateProductEnum } from '../enums/stateProduct.enum.js';
import { PhysicalConditionProductEnum } from '../enums/physicalConditionProduct.enum.js';

const DOCUMENT_NAME = 'product';
const COLLECTION_NAME = 'products';

export interface IProductDocument extends ProductZodSchemaType, Document {}

const commonImagesSchema = new Schema<IProductDocument['commonImages'][0]>(
  {
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

const commonSpecsSchema = new Schema<IProductDocument['commonSpecs'][0]>(
  {
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String],
      required: true
    }
  },
  {
    _id: false
  }
);

const usedInfoSchema = new Schema<IProductDocument['usedInfo']>(
  {
    physicalCondition: {
      type: String,
      enum: Object.values(PhysicalConditionProductEnum)
    },
    warrantyLeft: {
      type: Number,
      default: null
    },
    note: {
      type: String
    }
  },
  {
    _id: false
  }
);

const descriptionSchema = new Schema<IProductDocument['description']>(
  {
    time: {
      type: Number,
      required: true
    },
    version: {
      type: String,
      required: true
    },
    blocks: {
      type: [
        {
          type: {
            type: String
          },
          data: {}
        }
      ]
    }
  },
  {
    _id: false
  }
);

const newInfoSchema = new Schema<IProductDocument['newInfo']>(
  {
    typeProduct: {
      type: String,
      required: true
    },
    productCondition: {
      type: String,
      required: true
    },
    warrantyLeft: {
      type: String,
      required: true
    },
    priceInfo: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

const optionsSchema = new Schema<IProductDocument['options'][0]>(
  {
    name: {
      type: String,
      required: true
    },
    values: {
      type: [String],
      required: true
    },
    isCompareName: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);

const productSchema = new Schema<IProductDocument>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      default: null,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    commonImages: {
      type: [commonImagesSchema],
      default: []
    },
    commonSpecs: {
      type: [commonSpecsSchema],
      default: []
    },
    brandId: {
      type: Types.ObjectId,
      ref: 'brand',
      default: null,
      index: true
    },
    state: {
      type: Number,
      enum: StateProductEnum
    },
    usedInfo: {
      type: usedInfoSchema,
      default: null
    },
    newInfo: {
      type: newInfoSchema,
      default: null
    },
    description: {
      type: descriptionSchema,
      default: null
    },
    options: {
      type: [optionsSchema],
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export const Product = model<IProductDocument>(DOCUMENT_NAME, productSchema);
