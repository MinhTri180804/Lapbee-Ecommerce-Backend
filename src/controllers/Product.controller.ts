import { ProductResponseDTO } from './../dto/response/product/index.dto.js';
import { NextFunction, Request, Response } from 'express';
import { CreateProductRequestBody, createProductRequestBodySchema } from '../schema/zod/api/requests/product.schema.js';
import { ProductService } from '../services/Product.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type CreateRequestType = Request<unknown, unknown, CreateProductRequestBody>;

interface IProductController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class ProductController implements IProductController {
  private _productService: ProductService = new ProductService();
  constructor() {}

  public async create(request: CreateRequestType, response: Response): Promise<void> {
    const requestBody = request.body;

    const dataCreate = createProductRequestBodySchema.parse(requestBody);

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
