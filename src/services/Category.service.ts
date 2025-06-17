import {
  ChangeParentIdRequestBody,
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody
} from '../schema/zod/api/requests/category.schema.js';
import { ICategoryDocument } from '../models/category.model.js';
import { CategoryRepository } from '../repositories/Category.repository.js';
import { NotFoundError } from 'src/errors/NotFound.error.js';
import { CategoryNotExistError } from '../errors/CategoryNotExist.error.js';
import { BadRequestError } from 'src/errors/BadRequest.error.js';

type CreateParams = CreateCategoryRequestBody;
type DeleteParams = {
  categoryId: string;
  isForce: boolean;
};
type UpdateParams = {
  categoryId: string;
  updateData: UpdateCategoryRequestBody;
};
type GetDetailsParams = {
  categoryId: string;
};
type GetAllParams = {
  page: number;
  limit: number;
};

type ChangeParentIdParams = {
  categoryId: string;
} & ChangeParentIdRequestBody;

type GetAllReturns = {
  categoriesData: ICategoryDocument[];
  metadata: {
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    totalPage: number;
    totalDocument: number;
    limit: number;
  };
};

interface ICategoryService {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
  delete: (params: DeleteParams) => Promise<void>;
  update: (params: UpdateParams) => Promise<ICategoryDocument>;
  getDetails: (params: GetDetailsParams) => Promise<ICategoryDocument>;
  getAll: (params: GetAllParams) => Promise<GetAllReturns>;
  changeParentId: (params: ChangeParentIdParams) => Promise<ICategoryDocument>;
}

export class CategoryService implements ICategoryService {
  private _categoryRepository: CategoryRepository = new CategoryRepository();
  constructor() {}

  public async create(data: CreateParams): Promise<ICategoryDocument> {
    return await this._categoryRepository.create(data);
  }

  public async delete({ categoryId, isForce }: DeleteParams): Promise<void> {
    const category = await this._categoryRepository.findById({ id: categoryId });

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' });
    }

    const isExistChildCategories = await this._categoryRepository.checkHasChildCategories({ parentId: categoryId });

    if (isExistChildCategories && !isForce) {
      throw new BadRequestError<null>({
        message: 'This category has child categories. Please reassign or remove them before deleting.'
      });
    }

    if (isExistChildCategories && isForce) {
      await this._categoryRepository.updateManyParentId({ parentId: categoryId, newParentId: null });
    }

    await this._categoryRepository.deleteByDoc({ categoryDoc: category });

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

  public async getAll({ page, limit }: GetAllParams): Promise<GetAllReturns> {
    const skip = (page - 1) * limit;
    const { totalCount, paginatedResult } = await this._categoryRepository.find({ skip, limit });

    const totalPage = Math.ceil(totalCount / limit);

    return {
      categoriesData: paginatedResult,
      metadata: {
        totalDocument: totalCount,
        totalPage: totalPage,
        currentPage: page,
        nextPage: page < totalPage ? page + 1 : null,
        previousPage: page - 1 > 0 ? page - 1 : null,
        limit: limit
      }
    };
  }

  public async changeParentId({ categoryId, newParentId }: ChangeParentIdParams): Promise<ICategoryDocument> {
    const newParentIdIsExist = await this._categoryRepository.checkExist({ id: newParentId });
    if (!newParentIdIsExist) {
      throw new CategoryNotExistError({ message: 'ParentId of category is not exist' });
    }
    const category = await this._categoryRepository.changeParentId({ id: categoryId, newParentId });
    if (!category) {
      throw new NotFoundError({ message: 'Category not found' });
    }

    return category;
  }
}
