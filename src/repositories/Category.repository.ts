import { CategorySchemaType } from '../schema/zod/category/index.schema.js';
import { ICategoryDocument, Category } from '../models/category.model.js';

type CreateParams = CategorySchemaType;

interface ICategoryRepository {
  create: (params: CreateParams) => Promise<ICategoryDocument>;
}

export class CategoryRepository implements ICategoryRepository {
  private _categoryModel: typeof Category = Category;
  constructor() {}

  public async create(data: CreateParams): Promise<ICategoryDocument> {
    return await this._categoryModel.create(data);
  }
}
