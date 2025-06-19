import { CreateProductRequestBody } from '../schema/zod/api/requests/product.schema.js';
import { IProductDocument, Product } from '../models/product.model.js';

type CreateParams = CreateProductRequestBody;

interface IProductRepository {
  create: (params: CreateParams) => Promise<IProductDocument>;
}

export class ProductRepository implements IProductRepository {
  private _productModel: typeof Product = Product;
  constructor() {}

  public async create(data: CreateParams): Promise<IProductDocument> {
    return await this._productModel.create(data);
  }
}
