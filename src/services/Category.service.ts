import { CreateCategoryRequestBody, UpdateCategoryRequestBody } from '../schema/zod/api/requests/category.schema.js';
import { ICategoryDocument } from '../models/category.model.js';
import { CategoryRepository } from '../repositories/Category.repository.js';
import { NotFoundError } from 'src/errors/NotFound.error.js';

type CreateParams = CreateCategoryRequestBody;
type DeleteParams = {
  categoryId: string;
};
type UpdateParams = {
  categoryId: string;
  updateData: UpdateCategoryRequestBody;
};
type GetDetailsParams = {
  categoryId: string;
};

interface ICategoryService {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
  delete: (params: DeleteParams) => Promise<void>;
  update: (params: UpdateParams) => Promise<ICategoryDocument>;
  getDetails: (params: GetDetailsParams) => Promise<ICategoryDocument>;
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

  public async update({ updateData, categoryId }: UpdateParams): Promise<ICategoryDocument> {
    const categoryUpdated = await this._categoryRepository.update({ id: categoryId, updateData });
    if (!categoryUpdated) {
      throw new NotFoundError({ message: 'Not found category' });
    }

    return categoryUpdated;
  }

  public async getDetails({ categoryId }: GetDetailsParams): Promise<ICategoryDocument> {
    const category = await this._categoryRepository.findById({ id: categoryId });
    if (!category) {
      throw new NotFoundError({ message: 'Category not found' });
    }

    return category;
  }
}
