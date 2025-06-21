import { IProductVariantDocument, ProductVariant } from '../models/productVariant.model.js';
import { ProductVariantZodSchemaType } from '../schema/zod/productVariant/index.schema.js';
import { Types } from 'mongoose';

type CreateParams = ProductVariantZodSchemaType;
type FindExistingIdsParams = {
  ids: IProductVariantDocument['id'][];
};
type CreateManyParams = {
  data: ProductVariantZodSchemaType[];
};
type GetAllProductVariantsByProductParams = {
  productId: string;
};

interface IProductVariantRepository {
  create: (params: CreateParams) => Promise<IProductVariantDocument>;
  findExistingIds: (params: FindExistingIdsParams) => Promise<string[]>;
  createMany: (params: CreateManyParams) => Promise<IProductVariantDocument[]>;
  getAllProductVariantsByProduct: (params: GetAllProductVariantsByProductParams) => Promise<IProductVariantDocument[]>;
}

export class ProductVariantRepository implements IProductVariantRepository {
  private _productVariantModel: typeof ProductVariant = ProductVariant;

  constructor() {}

  public async create(createData: CreateParams): Promise<IProductVariantDocument> {
    return await this._productVariantModel.create(createData);
  }

  public async findExistingIds({ ids }: FindExistingIdsParams): Promise<string[]> {
    const result = await this._productVariantModel.find({ _id: { $in: ids } }).select('_id');
    return result.map((item) => item._id) as string[];
  }

  public async createMany({ data }: CreateManyParams): Promise<IProductVariantDocument[]> {
    return await this._productVariantModel.insertMany(data);
  }

  public async getAllProductVariantsByProduct({
    productId
  }: GetAllProductVariantsByProductParams): Promise<IProductVariantDocument[]> {
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
          $lookup: {
            from: 'brands',
            localField: 'brandId',
            foreignField: '_id',
            as: 'brand'
          }
        },
        {
          $project: {
            categoryId: 0,
            brandId: 0
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: '$brand',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .exec();
  }
}
