import { CreateProductVariantRequestBody } from '../schema/zod/api/requests/productVariant.schema.js';
import { IProductVariantDocument, ProductVariant } from '../models/productVariant.model.js';

type CreateParams = CreateProductVariantRequestBody & {
  productId: string;
};
type FindExistingIdsParams = {
  ids: IProductVariantDocument['id'][];
};

interface IProductVariantRepository {
  create: (params: CreateParams) => Promise<IProductVariantDocument>;
  findExistingIds: (params: FindExistingIdsParams) => Promise<string[]>;
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
}
