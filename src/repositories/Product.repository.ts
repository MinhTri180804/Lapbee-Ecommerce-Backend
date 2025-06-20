import { CreateProductRequestBody } from '../schema/zod/api/requests/product.schema.js';
import { IProductDocument, Product } from '../models/product.model.js';

type CreateParams = CreateProductRequestBody;
type CheckExistParams = {
  id: string;
};

interface IProductRepository {
  create: (params: CreateParams) => Promise<IProductDocument>;
  checkExist: (params: CheckExistParams) => Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  private _productModel: typeof Product = Product;
  constructor() {}

  public async create(data: CreateParams): Promise<IProductDocument> {
    return await this._productModel.create(data);
  }

  public async checkExist({ id }: CheckExistParams): Promise<boolean> {
    const product = await this._productModel.exists({ _id: id });
    if (!product) return false;
    return true;
  }
}
