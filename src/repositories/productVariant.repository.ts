import { IProductVariantDocument, ProductVariant } from '../models/productVariant.model.js';
import { ProductVariantZodSchemaType } from '../schema/zod/productVariant/index.schema.js';

type CreateParams = ProductVariantZodSchemaType;
type FindExistingIdsParams = {
  ids: IProductVariantDocument['id'][];
};
type CreateManyParams = {
  data: ProductVariantZodSchemaType[];
};

interface IProductVariantRepository {
  create: (params: CreateParams) => Promise<IProductVariantDocument>;
  findExistingIds: (params: FindExistingIdsParams) => Promise<string[]>;
  createMany: (params: CreateManyParams) => Promise<IProductVariantDocument[]>;
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
}
