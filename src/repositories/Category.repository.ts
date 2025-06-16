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

interface ICategoryRepository {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
  delete: (params: DeleteParams) => Promise<ICategoryDocument | null>;
  update: (params: UpdateParams) => Promise<ICategoryDocument | null>;
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
}
