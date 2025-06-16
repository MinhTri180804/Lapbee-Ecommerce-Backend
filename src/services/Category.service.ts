import { CreateCategoryRequestBody } from '../schema/zod/api/requests/category.schema.js';
import { ICategoryDocument } from '../models/category.model.js';
import { CategoryRepository } from '../repositories/Category.repository.js';

type CreateParams = CreateCategoryRequestBody;
interface ICategoryService {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
}

export class CategoryService implements ICategoryService {
  private _categoryRepository: CategoryRepository = new CategoryRepository();
  constructor() {}

  public async create(data: CreateParams): Promise<ICategoryDocument> {
    return await this._categoryRepository.create(data);
  }
}
