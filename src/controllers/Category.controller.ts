import { CategoryResponseDTO } from './../dto/response/category/index.dto.js';
import { NextFunction, Request, Response } from 'express';
import {
  ChangeOrderCategoryRequestBody,
  ChangeParentIdRequestBody,
  CreateCategoryRequestBody,
  createCategoryRequestBodySchema,
  UpdateCategoryRequestBody,
  updateCategoryRequestBodySchema
} from '../schema/zod/api/requests/category.schema.js';
import { CategoryService } from '../services/Category.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type CreateRequestType = Request<unknown, unknown, CreateCategoryRequestBody>;
type DeleteRequestType = Request<
  { id: string },
  unknown,
  unknown,
  {
    force?: boolean;
  }
>;
type UpdateRequestType = Request<{ id: string }, unknown, UpdateCategoryRequestBody>;
type GetDetailsRequestType = Request<{ id: string }>;
type GetAllRequestType = Request<
  unknown,
  unknown,
  unknown,
  {
    parentId?: string;
  }
>;
type ChangeParentIdRequestType = Request<{ id: string }, unknown, ChangeParentIdRequestBody>;
type ChangeOrderRequestType = Request<{ id: string }, unknown, ChangeOrderCategoryRequestBody>;

interface ICategoryController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  delete: (request: DeleteRequestType, response: Response, next: NextFunction) => Promise<void>;
  update: (request: UpdateRequestType, response: Response, next: NextFunction) => Promise<void>;
  getDetails: (request: GetDetailsRequestType, response: Response, next: NextFunction) => Promise<void>;
  getAll: (request: GetAllRequestType, response: Response, next: NextFunction) => Promise<void>;
  changeParentId: (request: ChangeParentIdRequestType, response: Response, next: NextFunction) => Promise<void>;
  getAllTree: (request: Request, response: Response, next: NextFunction) => Promise<void>;
  changeOrder: (request: ChangeOrderRequestType, response: Response, next: NextFunction) => Promise<void>;
}

const DEFAULT_PARENT_ID_GET_ALL = null;

export class CategoryController implements ICategoryController {
  private _categoryService: CategoryService = new CategoryService();
  constructor() {}

  public async create(request: CreateRequestType, response: Response): Promise<void> {
    const requestBody = request.body;

    const createData = createCategoryRequestBodySchema.parse(requestBody);
    const categoryData = await this._categoryService.create(createData);
    const categoryResponse = CategoryResponseDTO.create(categoryData);
    sendSuccessResponse<typeof categoryResponse>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create category success',
        data: categoryResponse
      }
    });
  }

  public async delete(request: DeleteRequestType, response: Response): Promise<void> {
    const { id } = request.params;
    const { force = false } = request.query;

    await this._categoryService.delete({ categoryId: id, isForce: Boolean(force) });
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Delete category success'
      }
    });
  }

  public async update(request: UpdateRequestType, response: Response): Promise<void> {
    const { id } = request.params;
    const requestBody = request.body;
    const updateData = updateCategoryRequestBodySchema.parse(requestBody);
    const categoryUpdated = await this._categoryService.update({ categoryId: id, updateData });
    const categoryUpdatedResponse = CategoryResponseDTO.update(categoryUpdated);

    sendSuccessResponse<typeof categoryUpdatedResponse>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Updated category success',
        data: categoryUpdatedResponse
      }
    });
  }

  public async getDetails(request: GetDetailsRequestType, response: Response): Promise<void> {
    const { id } = request.params;

    const category = await this._categoryService.getDetails({ categoryId: id });
    const categoryResponse = CategoryResponseDTO.getDetails(category);

    sendSuccessResponse<typeof categoryResponse>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get details category success',
        data: categoryResponse
      }
    });
  }

  public async getAll(request: GetAllRequestType, response: Response): Promise<void> {
    const { parentId = DEFAULT_PARENT_ID_GET_ALL } = request.query;

    const categoriesData = await this._categoryService.getAll({
      parentId
    });
    const categoriesResponse = CategoryResponseDTO.getAll(categoriesData);

    sendSuccessResponse<typeof categoriesResponse>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get all categories success',
        data: categoriesResponse
      }
    });
  }

  public async changeParentId(request: ChangeParentIdRequestType, response: Response): Promise<void> {
    const { newParentId } = request.body;
    const { id } = request.params;

    await this._categoryService.changeParentId({ categoryId: id, newParentId });
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Update new parent for category success'
      }
    });
  }

  public async getAllTree(_: Request, response: Response): Promise<void> {
    const categoriesTree = await this._categoryService.getAllTree();
    const categoriesTreeResponse = CategoryResponseDTO.getAllTree(categoriesTree);
    sendSuccessResponse<typeof categoriesTreeResponse>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get all categories tree success',
        data: categoriesTreeResponse
      }
    });
  }

  public async changeOrder(request: ChangeOrderRequestType, response: Response): Promise<void> {
    const { id } = request.params;
    const { newOrder } = request.body;
    await this._categoryService.changeOrder({ newOrder, categoryId: id });

    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Change order category success'
      }
    });
  }
}
