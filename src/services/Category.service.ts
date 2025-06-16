import { CreateCategoryRequestBody } from '../schema/zod/api/requests/category.schema.js';
import { ICategoryDocument } from '../models/category.model.js';
import { CategoryRepository } from '../repositories/Category.repository.js';
import { NotFoundError } from 'src/errors/NotFound.error.js';

type CreateParams = CreateCategoryRequestBody;
type DeleteParams = {
  categoryId: string;
};

interface ICategoryService {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
  delete: (params: DeleteParams) => Promise<void>;
}

export class CategoryService implements ICategoryService {
  private _categoryRepository: CategoryRepository = new CategoryRepository();
  constructor() {}

  public async create(data: CreateParams): Promise<ICategoryDocument> {
    return await this._categoryRepository.create(data);
  }

  public async delete({ categoryId }: DeleteParams): Promise<void> {
    const resultDocument = await this._categoryRepository.delete({ id: categoryId });

    if (!resultDocument) {
      throw new NotFoundError({ message: 'Category not found' });
    }

    return;
  }
}
