import { IBrandDocument } from 'src/models/brand.model.js';
import { IProductVariantDocument, ProductVariant } from '../models/productVariant.model.js';
import { ProductVariantZodSchemaType } from '../schema/zod/productVariant/index.schema.js';
import { Schema, Types } from 'mongoose';
import { ICategoryDocument } from 'src/models/category.model.js';
import { IProductDocument } from 'src/models/product.model.js';

type CreateParams = Omit<ProductVariantZodSchemaType, '_id'>;
type FindExistingIdsParams = {
  ids: IProductVariantDocument['id'][];
};
type CreateManyParams = {
  data: Omit<ProductVariantZodSchemaType, '_id'>[];
};
type GetAllProductVariantsByProductParams = {
  productId: string;
};
type GetDetailsBySlugParams = {
  slug: string;
};

interface IProductVariantRepository {
  create: (params: CreateParams) => Promise<IProductVariantDocument>;
  findExistingIds: (params: FindExistingIdsParams) => Promise<Schema.Types.ObjectId[]>;
  createMany: (params: CreateManyParams) => Promise<IProductVariantDocument[]>;
  getAllProductVariantsByProduct: (params: GetAllProductVariantsByProductParams) => Promise<
    (IProductVariantDocument & {
      brand: IBrandDocument;
      category: ICategoryDocument;
    })[]
  >;
  getDetailsBySlug: (params: GetDetailsBySlugParams) => Promise<IProductVariantDocument | null>;
}

export class ProductVariantRepository implements IProductVariantRepository {
  private _productVariantModel: typeof ProductVariant = ProductVariant;

  constructor() {}

  public async create(createData: CreateParams): Promise<IProductVariantDocument> {
    return await this._productVariantModel.create(createData);
  }

  public async findExistingIds({ ids }: FindExistingIdsParams): Promise<Schema.Types.ObjectId[]> {
    const result = await this._productVariantModel.find({ _id: { $in: ids } }).select('_id');
    return result.map((item) => item._id) as Schema.Types.ObjectId[];
  }

  public async createMany({ data }: CreateManyParams): Promise<IProductVariantDocument[]> {
    return await this._productVariantModel.insertMany(data);
  }

  public async getAllProductVariantsByProduct({ productId }: GetAllProductVariantsByProductParams): Promise<
    (IProductVariantDocument & {
      brand: IBrandDocument;
      category: ICategoryDocument;
    })[]
  > {
    return await this._productVariantModel
      .aggregate([
        {
          $match: { productId: new Types.ObjectId(productId) }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brandId',
            foreignField: '_id',
            as: 'brand'
          }
        },
        {
          $unwind: {
            path: '$brand',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            categoryId: 0,
            brandId: 0
          }
        }
      ])
      .exec();
  }

  public async getDetailsBySlug({ slug }: GetDetailsBySlugParams): Promise<
    | (IProductVariantDocument & {
        categoryId: ICategoryDocument | null;
        brandId: IBrandDocument | null;
        productId: IProductDocument;
      })
    | null
  > {
    return (await this._productVariantModel
      .findOne({ slug })
      .populate([{ path: 'categoryId' }, { path: 'brandId' }, { path: 'productId' }])) as
      | (IProductVariantDocument & {
          categoryId: ICategoryDocument | null;
          brandId: IBrandDocument | null;
          productId: IProductDocument;
        })
      | null;
  }
}
