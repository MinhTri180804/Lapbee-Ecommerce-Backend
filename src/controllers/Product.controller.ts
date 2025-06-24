import { NextFunction, Request, Response } from 'express';
import { ProductService } from '../services/Product.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';
import { CreateDTO as ProductCreateRequestDTO } from '../dto/request/product/create.dto.js';
import { ProductRequestDTO } from '../dto/request/product/index.dto.js';
import { ProductResponseDTO } from '../dto/response/product/index.dto.js';

type CreateRequestType = Request<unknown, unknown, ProductCreateRequestDTO>;

interface IProductController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class ProductController implements IProductController {
  private _productService: ProductService = new ProductService();
  constructor() {}

  public async create(request: CreateRequestType, response: Response): Promise<void> {
    const dataCreate = ProductRequestDTO.create(request.body);

    const productCreated = await this._productService.create(dataCreate);
    const createProductResponse = ProductResponseDTO.create(productCreated);
    sendSuccessResponse<typeof createProductResponse>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create product success',
        data: createProductResponse
      }
    });
  }
}
