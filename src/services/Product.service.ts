import { IProductDocument } from '../models/product.model.js';
import { ProductRepository } from '../repositories/Product.repository.js';
import { CategoryRepository } from '../repositories/Category.repository.js';
import { BadRequestError } from '../errors/BadRequest.error.js';
import { BrandRepository } from '../repositories/Brand.repository.js';
import { CreateDTO as ProductCreateRequestDTO } from '../dto/request/product/create.dto.js';

type CreateParams = ProductCreateRequestDTO;

interface IProductService {
  create: (params: CreateParams) => Promise<IProductDocument>;
}

export class ProductService implements IProductService {
  private _productRepository: ProductRepository = new ProductRepository();
  constructor() {}

  public async create(data: CreateParams): Promise<IProductDocument> {
    const categoryRepository = new CategoryRepository();
    const brandRepository = new BrandRepository();

    if (data.categoryId) {
      const categoryIsExist = await categoryRepository.checkExist({ id: data.categoryId });
      if (!categoryIsExist) {
        throw new BadRequestError({ message: 'Category is not exist' });
      }
    }

    if (data.brandId) {
      const brandIsExist = await brandRepository.checkExist({ id: data.brandId });
      if (!brandIsExist) {
        throw new BadRequestError({ message: 'Brand is not exist' });
      }
    }

    return await this._productRepository.create(data);
  }
}
