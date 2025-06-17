import { CategorySchemaType } from '../schema/zod/category/index.schema.js';
import { ICategoryDocument, Category } from '../models/category.model.js';
import { UpdateQuery } from 'mongoose';

type CreateParams = CategorySchemaType;
type DeleteParams = {
  id: string;
};
type UpdateParams = {
  updateData: UpdateQuery<ICategoryDocument>;
  id: string;
};
type FindByIdParams = {
  id: string;
};
type FindParams = {
  parentId: string | null;
};
type ChangeParentIdParams = {
  newParentId: string;
  id: string;
};
type CheckExistParams = {
  id: string;
};
type DeleteByDocParams = {
  categoryDoc: ICategoryDocument;
};
type CheckHasChildCategories = {
  parentId: string;
};
type UpdateManyParentIdParams = {
  parentId: string;
  newParentId: string | null;
};
type UpdateByDocParams = {
  categoryDoc: ICategoryDocument;
  updateData: UpdateQuery<ICategoryDocument>;
};

interface ICategoryRepository {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
  deleteById: (params: DeleteParams) => Promise<ICategoryDocument | null>;
  update: (params: UpdateParams) => Promise<ICategoryDocument | null>;
  findById: (params: FindByIdParams) => Promise<ICategoryDocument | null>;
  find: (params: FindParams) => Promise<ICategoryDocument[]>;
  changeParentId: (params: ChangeParentIdParams) => Promise<ICategoryDocument | null>;
  checkExist: (params: CheckExistParams) => Promise<boolean>;
  deleteByDoc: (params: DeleteByDocParams) => Promise<void>;
  checkHasChildCategories: (params: CheckHasChildCategories) => Promise<boolean>;
  updateManyParentId: (params: UpdateManyParentIdParams) => Promise<void>;
  updateByDoc: (params: UpdateByDocParams) => Promise<ICategoryDocument>;
}

export class CategoryRepository implements ICategoryRepository {
  private _categoryModel: typeof Category = Category;
  constructor() {}

  public async create(data: CreateParams): Promise<ICategoryDocument> {
    return await this._categoryModel.create(data);
  }

  public async deleteById({ id }: DeleteParams): Promise<ICategoryDocument | null> {
    const category = await this._categoryModel.findByIdAndDelete(id);
    return category;
  }

  public async update({ id, updateData }: UpdateParams): Promise<ICategoryDocument | null> {
    return await this._categoryModel.findByIdAndUpdate(id, updateData, {
      new: true
    });
  }

  public async findById({ id }: FindByIdParams): Promise<ICategoryDocument | null> {
    return await this._categoryModel.findById(id);
  }

  public async find({ parentId }: FindParams): Promise<ICategoryDocument[]> {
    return await this._categoryModel.find({ parentId }).exec();
  }

  public async changeParentId({ newParentId, id }: ChangeParentIdParams): Promise<ICategoryDocument | null> {
    return await this._categoryModel.findByIdAndUpdate(
      id,
      {
        parentId: newParentId
      },
      {
        new: true
      }
    );
  }

  public async checkExist({ id }: CheckExistParams): Promise<boolean> {
    const category = await this._categoryModel.exists({ _id: id });
    if (!category) return false;

    return true;
  }

  public async deleteByDoc({ categoryDoc }: DeleteByDocParams): Promise<void> {
    return await categoryDoc.deleteOne();
  }

  public async checkHasChildCategories({ parentId }: CheckHasChildCategories): Promise<boolean> {
    const result = await this._categoryModel.exists({ parentId });
    if (!result) return false;
    return true;
  }

  public async updateManyParentId({ parentId, newParentId }: UpdateManyParentIdParams): Promise<void> {
    await this._categoryModel.updateMany({ parentId }, { parentId: newParentId });
  }

  public async updateByDoc({ categoryDoc, updateData }: UpdateByDocParams): Promise<ICategoryDocument> {
    return await categoryDoc.updateOne(updateData, {
      new: true
    });
  }
}
