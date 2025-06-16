import { NextFunction, Request, Response } from 'express';
import { CreateCategoryRequestBody } from '../schema/zod/api/requests/category.schema.js';
import { CategoryService } from '../services/Category.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type CreateRequestType = Request<unknown, unknown, CreateCategoryRequestBody>;

interface ICategoryController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class CategoryController implements ICategoryController {
  private _categoryService: CategoryService = new CategoryService();
  constructor() {}

  public async create(request: CreateRequestType, response: Response): Promise<void> {
    const { name, slug, parentId } = request.body;

    const categoryData = await this._categoryService.create({ name, slug, parentId });

    sendSuccessResponse<typeof categoryData>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create category success',
        data: categoryData
      }
    });
  }
}
