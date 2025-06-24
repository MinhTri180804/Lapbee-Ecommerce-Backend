import {
  ChangeOrderCategoryRequestBody,
  ChangeParentIdRequestBody,
  CreateCategoryRequestBody,
  UpdateCategoryRequestBody
} from '../schema/zod/api/requests/category.schema.js';
import { ICategoryDocument } from '../models/category.model.js';
import { CategoryRepository } from '../repositories/Category.repository.js';
import { NotFoundError } from 'src/errors/NotFound.error.js';
import { CategoryNotExistError } from '../errors/CategoryNotExist.error.js';
import { BadRequestError } from 'src/errors/BadRequest.error.js';
import { BuildTree } from '../utils/buildTree.util.js';
import { TreeNode } from 'src/types/commons.type.js';

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
  parentId: string | null;
};

type ChangeParentIdParams = {
  categoryId: string;
} & ChangeParentIdRequestBody;

type ChangeOrderParams = ChangeOrderCategoryRequestBody & {
  categoryId: string;
};

interface ICategoryService {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
  delete: (params: DeleteParams) => Promise<void>;
  update: (params: UpdateParams) => Promise<ICategoryDocument>;
  getDetails: (params: GetDetailsParams) => Promise<ICategoryDocument>;
  getAll: (params: GetAllParams) => Promise<ICategoryDocument[]>;
  changeParentId: (params: ChangeParentIdParams) => Promise<ICategoryDocument>;
  getAllTree: () => Promise<TreeNode<ICategoryDocument>[]>;
  changeOrder: (params: ChangeOrderParams) => Promise<ICategoryDocument>;
}

export class CategoryService implements ICategoryService {
  private _categoryRepository: CategoryRepository = new CategoryRepository();
  constructor() {}

  public async create(data: CreateParams): Promise<ICategoryDocument> {
    if (data.parentId) {
      const parentCategory = await this._categoryRepository.findById({ id: data.parentId });
      if (!parentCategory) {
        throw new CategoryNotExistError({ message: 'Parent category not found' });
      }
      const categoryCreated = await this._categoryRepository.create({ ...data, hasChildren: false });
      if (!parentCategory.hasChildren) {
        await this._categoryRepository.updateByDoc({
          categoryDoc: parentCategory,
          updateData: {
            hasChildren: true
          }
        });
      }

      return categoryCreated;
    }

    return await this._categoryRepository.create({ ...data, hasChildren: false });
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

    if (category.parentId) {
      const parentHasChild = await this._categoryRepository.checkHasChildCategories({ parentId: category.parentId });
      if (!parentHasChild) {
        await this._categoryRepository.update({
          id: category.parentId,
          updateData: {
            hasChildren: false
          }
        });
      }
    }

    return;
  }

  public async update({ updateData, categoryId }: UpdateParams): Promise<ICategoryDocument> {
    let parentCategory: ICategoryDocument | null = null;

    if (updateData.parentId) {
      parentCategory = await this._categoryRepository.findById({ id: updateData.parentId });
      if (!parentCategory) {
        throw new CategoryNotExistError({ message: 'Parent category not exist' });
      }
    }

    const categoryUpdated = await this._categoryRepository.update({ id: categoryId, updateData });
    if (!categoryUpdated) {
      throw new NotFoundError({ message: 'Not found category' });
    }

    if (updateData.parentId && parentCategory && !parentCategory.hasChildren) {
      await this._categoryRepository.updateByDoc({
        categoryDoc: parentCategory,
        updateData: {
          hasChildren: true
        }
      });
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

  public async getAll({ parentId }: GetAllParams): Promise<ICategoryDocument[]> {
    if (parentId === 'root') {
      return await this._categoryRepository.find({ filter: undefined });
    }

    return await this._categoryRepository.findByParentId({ parentId });
  }

  public async changeParentId({ categoryId, newParentId }: ChangeParentIdParams): Promise<ICategoryDocument> {
    let parentCategory: ICategoryDocument | null = null;

    if (newParentId) {
      parentCategory = await this._categoryRepository.findById({ id: newParentId });
      if (!parentCategory) {
        throw new CategoryNotExistError({ message: 'ParentId of category is not exist' });
      }
    }

    const category = await this._categoryRepository.findById({ id: categoryId });
    if (!category) {
      throw new NotFoundError({ message: 'Category not found' });
    }

    await this._categoryRepository.updateByDoc({
      categoryDoc: category,
      updateData: {
        parentId: newParentId
      }
    });

    if (category.parentId) {
      const previousParentHasChild = await this._categoryRepository.checkHasChildCategories({
        parentId: category.parentId
      });

      if (!previousParentHasChild) {
        await this._categoryRepository.update({
          id: category.parentId,
          updateData: {
            hasChildren: false
          }
        });
      }
    }

    if (parentCategory && !parentCategory.hasChildren) {
      await this._categoryRepository.updateByDoc({
        categoryDoc: parentCategory,
        updateData: {
          hasChildren: true
        }
      });
    }

    return category;
  }

  public async getAllTree(): Promise<TreeNode<ICategoryDocument>[]> {
    const data = await this._categoryRepository.getAllTree();
    const buildTreeUtil = new BuildTree<ICategoryDocument>(data, '_id', 'parentId');
    const categoryTree = buildTreeUtil.getTree();
    return buildTreeUtil.sortTree(categoryTree, 'order');
  }

  public async changeOrder({ newOrder, categoryId }: ChangeOrderParams): Promise<ICategoryDocument> {
    const category = await this._categoryRepository.findById({ id: categoryId });
    if (!category) {
      throw new CategoryNotExistError({ message: 'Category change order not exist' });
    }

    const siblingCount = await this._categoryRepository.countDocument({ filter: { parentId: category.parentId } });

    if (newOrder < 1 || newOrder > siblingCount) {
      throw new BadRequestError({ message: `Invalid order: ${newOrder}, must be between 1 and ${siblingCount}` });
    }

    await this._categoryRepository.changeOrder({ parentId: category.parentId, newOrder, oldOrder: category.order });
    const categoryChangedOrder = await this._categoryRepository.updateByDoc({
      categoryDoc: category,
      updateData: {
        order: newOrder
      }
    });

    return categoryChangedOrder;
  }
}
