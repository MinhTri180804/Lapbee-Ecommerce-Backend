import { CategorySchemaType } from '../schema/zod/category/index.schema.js';
import { ICategoryDocument, Category } from '../models/category.model.js';
import { UpdateCategoryRequestBody } from 'src/schema/zod/api/requests/category.schema.js';

type CreateParams = CategorySchemaType;
type DeleteParams = {
  id: string;
};
type UpdateParams = {
  updateData: UpdateCategoryRequestBody;
  id: string;
};
type FindByIdParams = {
  id: string;
};
type FindParams = {
  limit: number;
  skip: number;
};
type ChangeParentIdParams = {
  newParentId: string;
  id: string;
};
type checkExistParams = {
  id: string;
};

interface ICategoryRepository {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
  delete: (params: DeleteParams) => Promise<ICategoryDocument | null>;
  update: (params: UpdateParams) => Promise<ICategoryDocument | null>;
  findById: (params: FindByIdParams) => Promise<ICategoryDocument | null>;
  find: (params: FindParams) => Promise<{
    paginatedResult: ICategoryDocument[];
    totalCount: number;
  }>;
  changeParentId: (params: ChangeParentIdParams) => Promise<ICategoryDocument | null>;
  checkExist: (params: checkExistParams) => Promise<boolean>;
}

export class CategoryRepository implements ICategoryRepository {
  private _categoryModel: typeof Category = Category;
  constructor() {}

  public async create(data: CreateParams): Promise<ICategoryDocument> {
    return await this._categoryModel.create(data);
  }

  public async delete({ id }: DeleteParams): Promise<ICategoryDocument | null> {
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

  public async find({ skip, limit }: FindParams): Promise<{
    paginatedResult: ICategoryDocument[];
    totalCount: number;
  }> {
    const result = await this._categoryModel
      .aggregate<{
        paginatedResult: ICategoryDocument[];
        totalCount: { count: number }[];
      }>([
        {
          $facet: {
            paginatedResult: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: 'count' }]
          }
        }
      ])
      .exec();

    return {
      paginatedResult: result[0].paginatedResult,
      totalCount: result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0
    };
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

  public async checkExist({ id }: checkExistParams): Promise<boolean> {
    const category = await this._categoryModel.exists({ _id: id });
    if (!category) return false;

    return true;
  }
}
